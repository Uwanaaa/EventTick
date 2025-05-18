import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../utils/websocket';
import { IoMdArrowRoundBack } from "react-icons/io";
import { BsBell } from 'react-icons/bs';
import './Inbox.css';

interface User {
    _id: string;
    name: string;
    email: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isOnline?: boolean;
}

const HostMessages: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalUnread, setTotalUnread] = useState(0);
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (socket && isConnected) {

            try {
                const timer = setTimeout(() => {
                    socket.emit('joinRoom', 'host_room'); // replace with meaningful room if needed
                    socket.emit('getHostMessages');
                  }, 500);

                socket.emit('getHostMessages');
                
                
                // Listen for updates
                socket.on('hostMessages', (data: { users: User[], unreadCount: number }) => {
                    console.log(data);
                    setUsers(data.users);
                    setTotalUnread(data.unreadCount);
                });
               

                // Listen for new messages
                socket.on('chat_message', () => {
                    socket.emit('getHostMessages');
                });
            } catch (error) {
                clearTimeout(timer);
                console.error('Error getting host messages:', error);
            }

            return () => {
                socket.off('hostMessages');
                socket.off('chat_message');
            };
        }
    }, [socket, isConnected]);

    const handleUserClick = (userId: string) => {
        navigate(`/host-chat/${userId}`);
    };

    if (!isConnected) {
        return <div className="loading">Connecting to chat server...</div>;
    }

    return (
        <div className="host-messages-container">
            <nav className="nav-bar">
                <div className="nav-left">
                    <button className="icon-button" onClick={() => navigate('/home')}>
                        <IoMdArrowRoundBack />
                    </button>
                    <h2>Messages</h2>
                </div>
                {totalUnread > 0 && (
                    <div className="nav-right">
                        <div className="notification-badge">
                            <BsBell />
                            {totalUnread}
                        </div>
                    </div>
                )}
            </nav>

            <div className="users-list">
                {users.length === 0 ? (
                    <p className="no-messages">No messages yet</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user._id}
                            className={`user-item ${user.unreadCount ? 'unread' : ''}`}
                            onClick={() => handleUserClick(user._id)}
                        >
                            <div className="user-info">
                                <div className="user-header">
                                    <div className="user-name-container">
                                        <span className="user-name">{user.name}</span>
                                        {user.isOnline && <span className="online-indicator" />}
                                    </div>
                                    {user.lastMessageTime && (
                                        <span className="message-time">
                                            {new Date(user.lastMessageTime).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {user.lastMessage && (
                                    <div className="last-message">{user.lastMessage}</div>
                                )}
                            </div>
                            {user.unreadCount ? (
                                <div className="unread-count">{user.unreadCount}</div>
                            ) : null}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HostMessages; 