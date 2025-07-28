import mongoose, { mongo } from "mongoose";
import { Skill } from "../models/skill.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SkillPlan } from "../models/skillPlan.model.js";


const createSkillPlan = asyncHandler(async(req, res) => {
    const {skillId} = req.params;
    const {targetLevel, durationInDays} = req.body;

    if(!targetLevel){
        throw new ApiError(400, "Bad request - must provide the target level")
    }

    if(!skillId){
        throw new ApiError(400, "Invalid request - Skill id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(401, "auth middleware is broken - user not found")
    }

    const skill = await Skill.findById(skillId)

    if(!skill) {
        throw new ApiError(400, "Invalid skill id - skill is not present in the databasse")
    }

    const existingSkillPlan = await SkillPlan.findOne({
        skill: skillId,
        user: user._id
    })

    if(existingSkillPlan){
        throw new ApiError(400, "Skill plan already exist!")
    }

    const skillPlan = await SkillPlan.create({
        skill: skillId,
        user: user._id,
        targetLevel: targetLevel.trim(),
        durationInDays: durationInDays || 30,
        currentDay: 1,
        completedDays: [],
        isCompleted: false,
    })

    if(!skillPlan){
        throw new ApiError(500, "Something went wrong while generating the Skill Plan")
    }

    const plan = await SkillPlan.findById(skillPlan._id).populate('skill')

    return res
    .status(200)
    .json(
        new ApiResponse(200, plan, "Skill Plan generated successfully")
    )
})


const getSkillPlanById = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;


    if(!skillPlanId){
        throw new ApiError(400, "Bad request - Skill plan id not found")
    }

    const user = req.user;

    const skillPlan = await SkillPlan.findById(skillPlanId).populate('skill')

    if(!skillPlan){
        throw new ApiError(400, "Skill plan not found")
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised access to the skill plan")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skillPlan, "Skill plan fetched successfully")
    )
})


const getAllSkillPlans = asyncHandler(async(req, res) => {
    const user = req.user;
    if(!user){
        throw new ApiError(401, "Auth middleware broken - user not found")
    }

    const skillPlans = await SkillPlan.findOne({
        user: new mongoose.Types.ObjectId(user._id)
    }).populate('skill')

    if(!skillPlans.length && !skillPlans){
        throw new ApiError(400, "No skills plan found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skillPlans, "Skill plans fetched successfully")
    )
})

const completeCurrentDay = asyncHandler(async(req, res) => {


    const {skillPlanId} = req.params;

    if(!skillPlanId) throw new ApiError(400, "Bad request - skill plan not found")

    const user = req.user

    if(!user){
        throw new ApiError(401,"Auth middleware broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, "No skill plan found")
    }

    const today = skillPlan.currentDay

    if(!skillPlan.completedDays.includes(today)){
        skillPlan.completedDays.push(today)
    }

    if(today < skillPlan.durationInDays){
        skillPlan.currentDay += 1;
    }
    else {
        skillPlan.isCompleted = true;
    }

    skillPlan.lastDeliveredNote = new Date()

    await skillPlan.save()


    return res
    .status(200)
    .json(
        new ApiResponse(200, skillPlan, `Skill plan for ${today} is marked as complete`)
    )
})




export {
    createSkillPlan,
    getAllSkillPlans,
    getSkillPlanById,
    completeCurrentDay
}