import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "advanced", "expert"],
        default: "Beginner",
    },
    category: {
        type: String,
        enum: ["frontend", "backend", "ai-ml", "Database", "devOps", "Webb3", "cybersecurity"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})


export const Skill = mongoose.model("Skill", skillSchema)