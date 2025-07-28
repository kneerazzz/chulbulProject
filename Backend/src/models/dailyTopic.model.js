import mongoose from "mongoose";

const dailyTopicSchema = new mongoose.Schema({
    skillPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillPlan",
        required: true
    },
    day: {
        type: Number,
        default: 1
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: ""
    }
}, {timestamps: true})


export const DailyTopic = mongoose.model("DailyTopic", dailyTopicSchema)