import mongoose from "mongoose";

const skillPlanSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    targetLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        required: true
    },
    durationInDays: {
        type: Number,
        default: 30
    },
    currentDay: {
        type: Number,
        default: 1
    },
    completedDays: {
        type: [Number],
        default: []
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    lastDeliveredNote: {
        type: Date
    },
    completedTopics: {
        type: [String],
        default: []
    }


}, {timestamps: true})


export const SkillPlan = mongoose.model("SkillPlan", skillPlanSchema)