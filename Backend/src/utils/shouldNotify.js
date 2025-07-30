export const shouldNotify = (user, type) => {
    if(!user.notificationPreferences) return true

    switch(type){
        case "reminder": 
            return user.notificationPreferences.push?.streakReminder ?? true;
        
        case "achievement":
            return true

        case "system": 
            return true
    }
}