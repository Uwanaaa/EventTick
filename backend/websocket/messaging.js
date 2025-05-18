import { redisClient } from "../config/redis.js";
import { Message } from "../models/messages.js";
import { ChatRoom } from "../models/chatRoom.js";
import { Notification } from "../models/notification.js";
import { verifyToken } from "../utils/generateToken.js";
import { User } from "../models/user.js";

export const messagingSocket = async (socket, namespace) => {
    try {
        // Get token from handshake auth
      
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("Token not provided");
            throw new Error('Authentication token not provided');
        }

       

        // Verify token and get user
        const decodedToken = verifyToken(token);
        const user = await User.findById(decodedToken.id).select('-password');
       
        if (!user) {
            throw new Error('User not found');
        }

        // Set user in socket
        socket.user = user;
        


        socket.on('joinRoom', async (roomName) => {
            try {
                socket.join(roomName);
                console.log(`User joined room: ${roomName}`);

                // Try to get messages from Redis cache first
                const cachedMessages = await redisClient.lRange(`chat:${roomName}`, -1, 0);
                if (cachedMessages.length > 0) {
                    const parsedMessages = cachedMessages.map((msg) => JSON.parse(msg));
                    console.log(parsedMessages);
                    socket.emit('oldMessages', parsedMessages);
                } else {
                    // If no Redis cache, fetch from MongoDB
                    const messages = await Message.find({ room: roomName })
                        .sort({ createdAt: 1 })
                        .limit(50);
                    socket.emit('oldMessages', messages);
                }

                // Mark notifications as read when joining room
                
                await Notification.updateMany(
                    { room: roomName, recipient: socket.user._id },
                    { isRead: true }
                );
            } catch (error) {
                console.error('Error fetching messages:', error);
                socket.emit('error', 'Failed to fetch messages');
            }
        });

        socket.on('chat_message', async ({ room, message }) => {
            try {

                // Create notification for recipient
                const [userId, hostId] = room.split('_');
                const recipientId = socket.user._id.toString().trim() == userId.trim() ? hostId : userId;
 
                
                // Save message to MongoDB
                const newMessage = await Message.create({
                    room,
                    sender: socket.user._id,
                    receiver: recipientId,
                    content: message,
                    createdAt: new Date()
                });

                await Notification.create({
                    recipient: recipientId,
                    sender: socket.user._id,
                    room,
                    message,
                    isRead: false
                });

                // Broadcast message to all users in the room
                namespace.to(room).emit('chat_message', { 
                    message, 
                    user: socket.user._id,
                    notification: {
                        type: 'message',
                        message: message,
                        room: room
                    }
                });

                // Cache message in Redis
                await redisClient.lPush(`chat:${room}`, JSON.stringify({
                    sender: socket.user._id,
                    content: message,
                    createdAt: newMessage.createdAt
                }));

                // Keep only last 50 messages in Redis cache
                await redisClient.lTrim(`chat:${room}`, 0, 49);

                console.log(`Message sent in room ${room}: ${message}`);
            } catch (error) {
                console.error('Error handling message:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        socket.on('getUnreadCount', async () => {
            try {
                const count = await Notification.countDocuments({
                    recipient: socket.user._id,
                    isRead: false
                });
                socket.emit('unreadCount', count);
            } catch (error) {
                console.error('Error getting unread count:', error);
            }
        });

        socket.on('getHostMessages', async () => {
            try {
            
                const messages = await Message.find({ receiver: socket.user._id })
                    .sort({ createdAt: -1 })
                    .populate('sender', 'name email');


                // Group messages by sender and get latest message per sender
                const latestMessagesBySender = messages.reduce((acc, message) => {
                    const senderId = message.sender._id.toString();
                    if (!acc[senderId]) {
                        acc[senderId] = {
                            _id: message.sender._id,
                            name: message.sender.name,
                            email: message.sender.email,
                            lastMessage: message.content,
                            lastMessageTime: message.createdAt,
                            unreadCount: 1
                        };
                    } else {
                        acc[senderId].unreadCount += 1;
                    }
                    return acc;
                }, {});

                // Convert to array and sort by last message time
                const users = Object.values(latestMessagesBySender)
                    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

                const unreadCount = users.reduce((sum, user) => sum + (user.unreadCount || 0), 0);

                socket.emit('hostMessages', { users, unreadCount });
                
            } catch (error) {
                console.error('Error getting messages:', error);
            }
        });

        socket.on('markAsRead', async ({ room, messageId, receiver }) => {
            await Message.updateMany({ room, receiver }, { isRead: true });
            console.log('Marked as read');
        });

        // socket.on('countUsersMessages', async () => {
        //     const messages = await Message.find({ receiver: socket.user._id })
        //     messages.reduce((acc, message) => {
        //         if (!acc[message.sender]) {
        //             acc[message.sender] = 1;
        //         } else {
        //             acc[message.sender]++;
        //         }
        //         return acc;
        //     }, {});
        //     console.log('Here');
            
        //     console.log(acc);
        //     socket.emit('usersCount', acc);
        // });


        socket.on('disconnect', () => {
            console.log('User disconnected from chat');
        });
    } catch (error) {
        console.error('Socket authentication error:', error);
        socket.emit('error', 'Authentication failed');
        socket.disconnect();
    }

    
};