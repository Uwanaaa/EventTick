import { Schema, model } from "mongoose";

const ChatRoomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// A compound index for faster queries
ChatRoomSchema.index({ participants: 1 });
ChatRoomSchema.index({ roomName: 1 });

export const ChatRoom = model('ChatRoom', ChatRoomSchema);
