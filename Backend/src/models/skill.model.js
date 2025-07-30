import mongoose from "mongoose";
import { StringDecoder } from "string_decoder";

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        default: "beginner",
    },
    category: {
        type: String,
        enum: ["frontend", "backend", "ai-ml", "database", "devops", "web3", "cybersecurity", 'system-design']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})


export const Skill = mongoose.model("Skill", skillSchema)