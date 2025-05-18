import { EventEmitter } from "events";
import { User } from "../models/user.js";
import { io } from "socket.io-client";

export const eventEmitter = new EventEmitter();
const socket = io('ws://localhost:5000/notification')

eventEmitter.on('matchNow', (user1,user2) => {
    let now = new Date()
    let futureTime = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    Matches.create({
        user1_id: user1,
        user2_id: user2,
        expiresAt: futureTime.toISOString()
    }
    ).then(() => {
        let user1_obj = User.findById(user1)
        let user2_obj = User.findById(user2)
        socket.emit('recieveNotification', user1, user2, `You have been matched with ${user1_obj.name} you have 48 to chat before matching expires`,`You have been matched with ${user2_obj.name} you have 48 to chat before matching expires`)
    })
})