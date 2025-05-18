import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../utils/websocket';
import axios from 'axios';
import './Inbox.css';

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email: string;
    };
    message: string;
    room: string;
    isRead: boolean;
    createdAt: string;
}

const Inbox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userType, setUserType] = useState<'host' | 'user' | null>(null);
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user/profile', {
                    withCredentials: true
                });
                setUserType(response.data.isHost ? 'host' : 'user');
            } catch (err) {
                console.error('Error fetching user type:', err);
            }
        };

        fetchUserType();
    }, []);

    useEffect(() => {
        if (userType && socket && isConnected) {
            // Get initial messages
            socket.emit(userType === 'host' ? 'getHostMessages' : 'getUserMessages');
            socket.emit('getUnreadCount');
            // Listen for new messages
            socket.on(userType === 'host' ? 'hostMessages' : 'userMessages', (newMessages: Message[]) => {
                setMessages(newMessages);
            });

            socket.on('unreadCount', (count: number) => {
                setUnreadCount(count);
            });

            socket.on('chat_message', (data) => {
                if (data.notification) {
                    socket.emit(userType === 'host' ? 'getHostMessages' : 'getUserMessages');
                    socket.emit('getUnreadCount');
                }
            });
            return () => {
                socket.off(userType === 'host' ? 'hostMessages' : 'userMessages');
                socket.off('unreadCount');
                socket.off('chat_message');
            };
        }
    }, [userType, socket, isConnected]);

    const handleMessageClick = (room: string) => {
        const [userId, hostId] = room.split('_');
        navigate(`/chat/${userType === 'host' ? userId : hostId}`);
    };

    if (!userType) {
        return <div className="loading">Loading...</div>;
    }

    if (!isConnected) {
        return <div className="loading">Connecting to chat server...</div>;
    }

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-left">
                    <button className="icon-button" onClick={() => navigate('/home')} title="Back to Home">
                        <IoMdArrowRoundBack />
                    </button>
                </div>
                {unreadCount > 0 && (
                    <div className="notification-badge">
                        {unreadCount}
                    </div>
                )}
            </nav>
            <div className="inbox-container">
                <div className="inbox-header">
                    <h2>{userType === 'host' ? 'Host Inbox' : 'My Messages'}</h2>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="messages-list">
                    {messages.length === 0 ? (
                        <p className="no-messages">No messages yet</p>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`message-item ${!msg.isRead ? 'unread' : ''}`}
                                onClick={() => handleMessageClick(msg.room)}
                            >
                                <div className="message-header">
                                    <span className="sender-name">{msg.sender.name}</span>
                                    <span className="message-time">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="message-preview">{msg.message}</div>
                                {!msg.isRead && <div className="unread-indicator" />}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Inbox; 