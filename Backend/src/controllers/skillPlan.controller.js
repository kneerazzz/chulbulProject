import mongoose, { mongo } from "mongoose";
import { Skill } from "../models/skill.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SkillPlan } from "../models/skillPlan.model.js";
import { DailyTopic } from "../models/dailyTopic.model.js";
import { updateStreak } from "../utils/streak.js";
import { shouldNotify } from "../utils/shouldNotify.js";
import { Notification } from "../models/notification.model.js";


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
        completedSubtopics: []
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

    const skillPlans = await SkillPlan.find({
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
    const { skillPlanId } = req.params;
    const user = req.user;

    // Validate input
    if (!skillPlanId) throw new ApiError(400, "Skill plan ID required");
    if (!user) throw new ApiError(401, "Unauthorized");

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const skillPlan = await SkillPlan.findById(skillPlanId).session(session);
        if (!skillPlan) throw new ApiError(404, "Skill plan not found");
        if (!skillPlan.user.equals(user._id)) throw new ApiError(403, "Unauthorized");

        const today = skillPlan.currentDay;
        
        // Validate day completion
        if (skillPlan.completedDays.includes(today)) {
            throw new ApiError(400, "Day already completed");
        }

        // Get today's topic if exists
        const todayTopic = await DailyTopic.findOne({
            skillPlan: skillPlan._id,
            day: today
        }).session(session);

        // Update skill plan
        if (todayTopic?.topic && !skillPlan.completedSubtopics.some(
            sub => sub.title.toLowerCase() === todayTopic.topic.toLowerCase()
        )) {
            skillPlan.completedSubtopics.push({
                title: todayTopic.topic,
                completedAt: new Date()
            });
        }

        skillPlan.completedDays.push(today);
        skillPlan.lastDeliveredNote = new Date();

        // Handle plan completion
        if (today >= skillPlan.durationInDays) {
            skillPlan.isCompleted = true;
            if (!user.completedSkills.includes(skillPlan.skill)) {
                user.completedSkills.push(skillPlan.skill);
            }
        } else {
            skillPlan.currentDay += 1;
        }

        // Update streak
        updateStreak(user);
        // Send notifications (optimized)
        const notifications = [];
        if (user.streak > 1 && shouldNotify(user, "reminder")) {
            notifications.push({
                user: user._id,
                message: `You're on a ${user.streak}-day streak. Keep going`,
                type: "reminder"
            });
        }

        if (skillPlan.isCompleted) {
            const skill = await Skill.findById(skillPlan.skill).session(session);
            notifications.push({
                user: user._id,
                message: `Completed ${skillPlan.durationInDays} day plan for ${skill?.title}`,
                type: "achievement"
            });
        }

        notifications.push({
            user: user._id,
            message: `Completed day ${today} of your skill plan`,
            type: "progress"
        });

        if (notifications.length > 0) {
            await Notification.insertMany(notifications, { session });
        }

        // Save all changes
        await Promise.all([
            skillPlan.save({ session }),
            user.save({ validateBeforeSave: false, session })
        ]);

        await session.commitTransaction();

        return res.status(200).json(
            new ApiResponse(200, skillPlan, `Day ${today} completed successfully`)
        );

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

const updateSkillPlan = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    const {targetLevel, durationInDays} = req.body;

    if(!targetLevel && !durationInDays){
        throw new ApiError(400,"Nothing to update here")
    }

    if(!skillPlanId){
        throw new ApiError(400, "Skill plan id not found")
    }

    const user = req.user

    if(!user){
        throw new ApiError(400, "Auth middleware broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId).populate("skill")


    if(!skillPlan){
        throw new ApiError(400, "Skill plan not found")
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised access")
    }

    skillPlan.targetLevel = targetLevel;

    skillPlan.durationInDays = durationInDays;

    await skillPlan.save({validateBeforeSave: false})


    return res
    .status(200)
    .json(
        new ApiResponse(200, skillPlan, "Skill plan updated successfully")
    )
1
})

const deleteSkillPlan = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "auth middleware is broken - User not found")
    }


    const skillPlan = await SkillPlan.findOneAndDelete({
        _id: skillPlanId,
        user: user._id
    })

    if(!skillPlan){
        throw new ApiError(401, "Either skill plan not found or user is not authenticated to delete this plan")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skillPlan._id, "Skill plan deleted successfully")
    )
})


const getSkillPlanProgress = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "No skill plan id found")
    }

    const user  = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, "No skill plan found")
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(403, "Unauthorised access can't access other user detsils")
    }

    const completedSubtopicsLength = skillPlan.completedSubtopics.length || 0;

    const durationOfPlan = skillPlan.durationInDays;

    const progress = (completedSubtopicsLength/durationOfPlan) * 100;

    return res
    .status(200)
    .json(
        new ApiResponse(200, progress, "Progress of the plan fetched")
    )
})


export {
    createSkillPlan,
    getAllSkillPlans,
    getSkillPlanById,
    updateSkillPlan,
    completeCurrentDay,
    deleteSkillPlan,
    getSkillPlanProgress
}