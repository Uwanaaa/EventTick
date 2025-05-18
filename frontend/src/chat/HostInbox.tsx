import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../utils/websocket';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import axios from 'axios';
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

const HostInbox: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (socket && isConnected) {
            // Get initial messages and users
            socket.emit('getHostMessages');
            socket.emit('getUnreadCount');

            // Listen for new messages
            socket.on('hostMessages', (data: { users: User[], unreadCount: number }) => {
                setUsers(data.users);
                setUnreadCount(data.unreadCount);
            });

            socket.on('unreadCount', (count: number) => {
                setUnreadCount(count);
            });

            // Listen for new messages to update the user list
            socket.on('chat_message', (data) => {
                if (data.notification) {
                    socket.emit('getHostMessages');
                    socket.emit('getUnreadCount');
                    
                    // Show notification
                    setNotificationMessage(`New message from ${data.senderName}`);
                    setShowNotification(true);
                    
                    // Hide notification after 3 seconds
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                }
            });

            // Listen for user online status
            socket.on('userStatus', (data: { userId: string, isOnline: boolean }) => {
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user._id === data.userId 
                            ? { ...user, isOnline: data.isOnline }
                            : user
                    )
                );
            });

            return () => {
                socket.off('hostMessages');
                socket.off('unreadCount');
                socket.off('chat_message');
                socket.off('userStatus');
            };
        }
    }, [socket, isConnected]);

    const handleUserClick = (userId: string) => {
        navigate(`/chat/${userId}`);
    };

    if (!isConnected) {
        return <div className="loading">Connecting to chat server...</div>;
    }

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-left">
                    <button className="icon-button" onClick={() => navigate('/home')}>
                        <IoMdArrowRoundBack />
                    </button>
                </div>
                <div className="nav-right">
                    {unreadCount > 0 && (
                        <div className="notification-badge">
                            {unreadCount}
                        </div>
                    )}
                </div>
            </nav>
            
            <div className="inbox-container">
                <div className="inbox-header">
                    <h2>Host Inbox</h2>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="users-list">
                    {users.length === 0 ? (
                        <p className="no-messages">No conversations yet</p>
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

            {showNotification && (
                <div className="notification-toast">
                    <FaBell className="notification-icon" />
                    <span>{notificationMessage}</span>
                </div>
            )}
        </>
    );
};

export default HostInbox; 