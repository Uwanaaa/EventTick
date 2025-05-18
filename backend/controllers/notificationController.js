import { Notification } from "../models/notification.js";


export const deleteNotification = (req,res) => {
    const notification_id = req.query.notification_id

    if (!notification_id){
        res.status(500).json({message:'No notification id was provided'})
    }else{
        Notification.findOneAndDelete({id:notification_id})
        .then( () => {
            res.status(201).json({message: `The notification has been deleted`});
        })
        .catch( (e) => {
            console.log(`Error: ${e}`);
            res.status(500).json({message:'Server error'})
        })
    }
}


export const filterNotification = async (req,res) => {
    const date = req.params.date

    if (!date){
        res.status(500).json({message:'No date was provided'})
    }else{
        const notifications = await Notification.find({sent_at:date,user_id:req.user._id})
        .then( () => {
            res.status(201).json({message: `${notifications}`});
        })
        .catch( (e) => {
            console.log(`Error: ${e}`);
            res.status(500).json({message:'Server error'})
        })
        }
}


export const changeNotificationStatus = async (req,res) => {
    const notification_id = req.params.id

    if (!notification_id){
        res.status(500).json({message:'No notification id was provided'})
    }else{
        await Notification.findByIdAndUpdate({id:notification_id},{status:'opened'})
        .then(() => {
            res.status(200).json({message:'The notification status has been updated'})
        })
        .catch((e) => {
            console.log(`Error: ${e}`);
            res.status(400).json({message:'Server error'})
        })
        }
}


export const allNotifications = async (req,res) => {
    await Notification.find({user_id:req.user._id})
    .then( (notifications) => {
        res.status(201).json({message: `${notifications}`});
    })
    .catch( (e) => {
        console.log(`Error: ${e}`);
        res.status(500).json({message:'Server error'})
    })
}


export const getTotalMatches = async (req,res) => {
    const date = new Date();
    try{
        const total_matches = await Matches.countDocuments({matched_at:date,$or: [
            {user1_id:req.user._id},
            {user2_id:req.user._id}
        ]});
        res.status(201).json({message: `${total_matches}`});
    }
    catch (error) {
        console.log(`Error: ${error}`)
        res.status(400).json({message:'Server error'})
    }
}


export const getTotalLikes = async(req,res) => {
    const date = new Date();
    try{
        const total_matches = await LikesAndDislikes.countDocuments({sent_at:date,status:'like',$or: [
            {user1_id:req.user._id},
            {user2_id:req.user._id}
        ]});
        res.status(201).json({message: `${total_matches}`});
    }
    catch(error) {
        console.log(`Error: ${error}`);
        res.status(400).json({message:'Server error'})
    }
}


export const getTotalDislikes = async(req,res) => {
    const date = new Date();
    try{
        const total_matches = await LikesAndDislikes.countDocuments({sent_at:date,status:'dislike',$or: [
            {user1_id:req.user._id},
            {user2_id:req.user._id}
        ]});
        res.status(201).json({message: `${total_matches}`});
    }
    catch(error) {
        console.log(`Error:${error}`);
        res.status(400).json({message:'Server error'})
    }  
}