import mongoose from "mongoose";
import { type } from "os";
import { title } from "process";
import { stringify } from "querystring";

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
        enum: ["beginner", "intermediate", "advanced", "expert"],
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
    completedSubtopics: {
        type: [
            {
                title: {type: String, required: true},
                completedAt: {type: Date, default: Date.now}
            }
        ],
        default: []
    }


}, {timestamps: true})


export const SkillPlan = mongoose.model("SkillPlan", skillPlanSchema)