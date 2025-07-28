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
        enum: ["beginner", "intermediate", "advanced", "expert"],
        default: "Beginner",
    },
    category: {
        type: String,
        enum: ["frontend", "backend", "ai-ml", "Database", "devops", "web3", "cybersecurity"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})


export const Skill = mongoose.model("Skill", skillSchema)