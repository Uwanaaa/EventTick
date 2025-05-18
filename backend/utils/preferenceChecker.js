
export const preferenceChecker = (users,targetUser) => {
    const suggestedUsers = []
    users.forEach( user => {
        if (user.gender == targetUser.preferences.gender){
            if (user.age >  targetUser.preferences.ageRange.min){
                if (user.age < targetUser.preferences.ageRange.max){
                    suggestedUsers.push(user);
                }
            }
        }
    });
    return suggestedUsers;
}