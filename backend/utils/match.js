


export const matcher = (user_1,user_2) => {
    if_match = LikesAndDislikes.find({user1_id:user_1},{user2_id:user_2},{status:'like'})
    if (if_match){
        const expiresTime = new Date(Date.now() + 48 * 60 * 60 * 1000)
        Matches.create({
            user1_id:user_1,
            user2_id:user_2,
            expiresAt:expiresTime,
            isActive:true
        })
    }
}