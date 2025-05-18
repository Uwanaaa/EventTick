import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSocket } from "../utils/websocket";
import axios from "axios";
import "./ChatInterface.css";

interface Message {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const HostChat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch current user's data
        const currentUserResponse = await axios.get('http://localhost:5000/user/user-data', {
          withCredentials: true
        });
        setCurrentUserId(currentUserResponse.data._id);

        const response = await axios.get(`http://localhost:5000/user/user-data/${userId}`, {
          withCredentials: true
        });
        setUsername(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (socket && isConnected && userId && currentUserId) {
      const roomName = `${userId}_${currentUserId}`;
      setRoom(roomName);
      

      // Join room
      socket.emit('joinRoom', roomName);
      socket.emit('getHostMessages');
      socket.on('hostMessages', (data) => {
        console.log(data);
      });

      // Listen for old messages
      socket.on('oldMessages', (oldMessages) => {
        setMessages(oldMessages);
        scrollToBottom();
      });

      // Listen for new messages
      socket.on('chat_message', (data) => {
        // Add message to the list immediately
        setMessages(prev => [...prev, data]);
        scrollToBottom();

        // Mark message as read
        if (data.sender !== currentUserId) {
          socket.emit('markAsRead', { room: roomName, messageId: data._id, receiver: userId || '' });
        } else {
          socket.emit('markAsRead', { room: roomName, messageId: data._id, receiver: currentUserId || '' });
        }
      });

      return () => {
        socket.off('oldMessages');
        socket.off('chat_message');
      };
    }
  }, [socket, isConnected, userId, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket && isConnected && room) {
      // Create a temporary message object
      const tempMessage = {
        _id: Date.now().toString(), // Temporary ID
        sender: currentUserId!,
        content: newMessage.trim(),
        createdAt: new Date().toISOString()
      };

      // Add message to the list immediately
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      scrollToBottom();

      // Send message to server
      socket.emit('chat_message', {
        room,
        message: newMessage.trim()
      });
    }
  };

  if (!isConnected) {
    return <div className="loading">Connecting to chat server...</div>;
  }

  if (!userId || !currentUserId) {
    return <div className="loading">Loading chat...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div className="chat-header">
          <div className="nav-left">
            <button className="icon-button" onClick={() => navigate('/host-messages')} title="Back to Messages">
              <IoMdArrowRoundBack />
            </button>
            <h2>{username}</h2>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={msg._id}
              className={`message ${msg.sender === currentUserId ? 'sent' : 'received'}`}
            >
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-button" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostChat;
