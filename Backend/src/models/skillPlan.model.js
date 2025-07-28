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
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: true
    },


}, {timestamps: true})


export const SkillPlan = mongoose.model("SkillPlan", skillPlanSchema)