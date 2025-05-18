import { Message } from "../models/messages.js";



export const filterMessage = async(req,res) => {
    const date = req.query.date
    const user_2_id = req.query.user_2_id

    if (!date && !user_2_id){
        res.status(500).json({message:'A date and other user was not provided'})
    }else{
        await Message.find({sent_at:date,user_1_id:req.user,user_2_id:user_2_id})
        .then( (messages) => {
            res.status(201).json({message: `${messages}`});
        })
        .catch( (e) => {
            console.log(`Error: ${e}`);
            res.status(500).json({message:'Server error'})
        })
    }
}


export const deleteChat = async(req,res) => {
    const message_id = req.query.message_id

    if(!message_id){
        res.status(400).json({message:'A message to be deleted has not been provided'})
    }else{
        await Message.findOneAndDelete({id:message_id})
        .then( () => {
            res.status(201).json({message: `The message has been deleted`});
        })
        .catch( (e) => {
            console.log(`Error: ${e}`);
            res.status(500).json({message:'Server error'})
        })
    }
}


export const deleteConversation = async(req,res) => {
    const user_2_id = req.query.user_2_id

    if(!user_2_id){
        res.status(500).json({message:'No other user was provided'})
    }else{
        await Message.deleteMany({user_2_id:user_2_id})
        .then( () => {
            res.status(201).json({message: `The conversation has been deleted`});
        })
        .catch( (e) => {
            console.log(`Error: ${e}`);
            res.status(500).json({message:'Server error'})
        })
    }
}


export const deleteMatch = async(req,res) => {
    try {
        const user_2_id = req.query.user_id; 

        if (!user_2_id) {
            return res.status(400).json({ message: "The other user was not provided" });
        }
        await Matches.findOneAndDelete({ user1_id: req.user._id, user2_id: user_2_id });
        await Message.deleteMany({
            $or: [
                { sender_id: req.user._id, receiver_id: user_2_id },
                { sender_id: user_2_id, receiver_id: req.user._id }
            ]
        });

        res.status(200).json({ message: "The match and messages have been deleted successfully" });

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: "Server error" });
    }
}