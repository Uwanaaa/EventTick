import mongoose, { Schema } from 'mongoose';
import User from './user';

const ticketSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number,
        required: false
    },
    status: { 
        type: String,
        required: false
    },
    host: {
         type: Schema.ObjectId,
         ref: 'User',
         required: true
    },
    gender: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
         type: Date, 
         default: Date.now
     },
});

export default mongoose.model('tickets', ticketSchema);