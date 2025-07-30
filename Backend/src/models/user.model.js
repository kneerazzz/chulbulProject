import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { siTina } from 'simple-icons'


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profilePic: {
        type: String, //cloudinary
        default: 'https://res.cloudinary.com/dmrf8lhcf/image/upload/v1753587887/unc_rt6eou.jpg'
    },
    bio: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
    },
    streak: {
        type: Number,
        default: 0
    },
    completedSkills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill"
    }],
    level: {
        type: Number,
        default: 1
    },
    interests: {
        type: [String],
        enum: ['frontend', 'backend', 'ai-ml', 'devOps', 'cybersecurity', 'web3', 'database', 'system-design', 'algorithm'],
        default: []
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    },
    lastCompletedDate: {
        type: Date,
        default: null
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    notificationPreferences: {
        email: {
            dailyReminder: {type: Boolean, default: true},
            weeklyProgress: {type: Boolean, default: true},
        },
        push: {
            streakReminder: {type: Boolean, default: true}
        }
    }
}, {timestamps: true})


userSchema.pre('save', async function (next) {
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}



userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign (
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema)