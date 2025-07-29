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
    },
    content: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    optionalTip: {
        type: String,
        default: ""
    },
    isRegenrated: {
        type: Boolean,
        default: false
    },
}, {timestamps: true})


export const DailyTopic = mongoose.model("DailyTopic", dailyTopicSchema)