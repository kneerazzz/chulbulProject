
export const updateStreak = async (user) => {
    const now = new Date()

    const last = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null

    if(last){
        const diffInDays = Math.floor((now-last)/ (1000 * 60 * 24 * 60))

        if(diffInDays === 0){
            return
        }

        else if(diffInDays === 1){
            user.streak += 1;
        }
        else {
            user.streak = 1
        }
    }

    user.lastCompletedDate = now;

    if(user.streak > user.longestStreak){
        user.longestStreak = user.streak
    }

}