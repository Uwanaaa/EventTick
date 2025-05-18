import { Server } from 'socket.io'
import { messagingSocket } from './messaging.js';
import { notificationSocket } from './notification.js';

export const setupWebsocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  })


  //Websocket namespaces
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("New client connected");
    messagingSocket(socket, chatNamespace); 
  });

  // const notificationNamespace = io.of("/notification");

  // notificationNamespace.on("connection", (socket) => {
  //   console.log("New client connected 2");
  //   notificationSocket(socket, notificationNamespace); 
  // });

  return io 
}
