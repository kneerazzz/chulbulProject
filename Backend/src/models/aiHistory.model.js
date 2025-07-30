import mongoose, { model, now } from "mongoose";

const aiHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skillPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillPlan",
        required: true
    },
    generatedTopics: {
        type: [
            {
            title: { type: String, required: true },
            generatedAt: { type: Date, default: Date.now },
            model: { type: String, default: "Gemini 1.5 Pro" }
            }
        ],
        default: []
    },
    day: {
        type: Number,
        required: true
    }

}, {timestamps: true})

export const AiHistory = mongoose.model("AiHistory", aiHistorySchema)