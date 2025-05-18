import {Schema, model} from "mongoose";

const ticketSchema = new Schema({
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

export const Ticket = model("tickets", ticketSchema)