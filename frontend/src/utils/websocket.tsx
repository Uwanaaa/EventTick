import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useState, useEffect } from 'react';

const SOCKET_URL = 'http://localhost:5000/chat';

interface User {
    _id: string;
    name: string;
    email: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isOnline?: boolean;
}

interface SocketAuth {
    token: string;
}

interface ServerToClientEvents {
    oldMessages: (messages: any[]) => void;
    chat_message: (data: any) => void;
    error: (error: string) => void;
    unreadCount: (count: number) => void;
    hostMessages: (data: { users: User[], unreadCount: number }) => void;
    userMessages: (data: { users: User[], unreadCount: number }) => void;
    userStatus: (data: { userId: string, isOnline: boolean }) => void;
    getUnreadCount: () => void;
    getHostMessages: () => void;
    getUserMessages: () => void;
    usersCount: (data: { users: User[], unreadCount: number }) => void;
}

interface ClientToServerEvents {
    joinRoom: (room: string) => void;
    chat_message: (data: { room: string; message: string }) => void;
    getUnreadCount: () => void;
    getHostMessages: () => void;
    getUserMessages: () => void;
    markAsRead: (data: { room: string; messageId: string, receiver: string }) => void;
    countUsersMessages: () => void;
}

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const initializeSocket = async () => {
            try {
                // Get token from API
                const response = await axios.get('http://localhost:5000/user/getToken', {
                    withCredentials: true
                });
                
                const token = response.data.token;
                

                if (!token) {
                    console.error('No token received');
                    return;
                }

                // Initialize socket with token
                const newSocket = io(SOCKET_URL, {
                    transports: ["websocket"],
                    auth: {
                        token: token
                    },
                    withCredentials: true
                });

                // Socket event handlers
                newSocket.on('connect', () => {
                    console.log('Socket connected');
                    setIsConnected(true);
                });

                newSocket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                    setIsConnected(false);
                });

                newSocket.on('error', (error) => {
                    console.error('Socket error:', error);
                });

                newSocket.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

                setSocket(newSocket);

                
                return () => {
                    newSocket.close();
                };
            } catch (error) {
                console.error('Error initializing socket:', error);
            }
        };

        initializeSocket();
    }, []); 

    return { socket, isConnected };
};


