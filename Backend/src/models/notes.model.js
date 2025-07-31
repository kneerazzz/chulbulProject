import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
    },
    skillPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillPlan"
    },
    content: {
        type: String,
        default: "",
        trim: true
    },
    day: {
        type: Number,
        default: 1
    }
}, {timestamps: true})


export const Notes = mongoose.model("Notes", notesSchema)