import { Schema, model } from 'mongoose';

const blockedUsersSchema = new Schema({
    id: {
        type: Schema.Types.UUID,
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    blocked_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reason: {
         type: Schema.Types.String,
    },
    status: {
        type: Schema.Types.String,
        default: 'Unblocked'
    },
    created_at: {
        type: Schema.Types.Date
    },
    updated_at: {
        type: Schema.Types.Date
    }
});

export const blockedUser = model('blockedUser', blockedUsersSchema);