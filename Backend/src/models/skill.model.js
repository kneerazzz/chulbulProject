import mongoose from "mongoose";
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
        enum: ["frontend", "backend", "ai-ml", "database", "devops", "web3", "cybersecurity", 'system-design', 'languages', 'business', 'other', 'marketing', 'design', 'management', 'algorithm']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})


export const Skill = mongoose.model("Skill", skillSchema)