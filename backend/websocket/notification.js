import { Notification } from "../models/notification.js";


export const notificationSocket = (socket,namespace) => {
    // socket.on('connection', () => {
    //     console.log(`Connection logged`);
    // })

    socket.on('recieveNotification', (user1, user2, message1, message2) => {
        console.log(message1);

    //     try{
    //         Promise.all([
    //             Notification.create({
    //                 user_id: user1,
    //                 message: message1,
    //                 status: 'not opened'
    //             }),
    //             Notification.create({
    //                 user_id: user2,
    //                 message: message2,
    //                 status: 'not opened'
    //             })
    //         ])
    //         .then(() => {
    //             socket.emit('message', message1)
    //             socket.emit('message', message2)
    //         })
    //         .catch((e) => {
    //             console.log(`Error: ${e}`)
    //             socket.emit('message', e)
    //         })
    //     }catch(e){
    //         console.log(`Error: ${e}`)
    //         socket.emit('message',e)
    //     } 
    })
}