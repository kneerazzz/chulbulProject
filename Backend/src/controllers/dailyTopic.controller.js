import { SkillPlan } from "../models/skillPlan.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateTopicContent from "../utils/generateContent.js";
import { Skill } from "../models/skill.model.js";
import { DailyTopic } from "../models/dailyTopic.model.js";
import { ApiResponse } from "../utils/apiResponse.js";


const createDailyTopic = asyncHandler(async(req, res) => {

    const {skillPlanId} = req.params;

    if(!skillPlanId) {
        throw new ApiError(400, "Bad request - skill plan id not found")
    }
    const user = req.user;

    if(!user) {
        throw new ApiError(400, "Auth middleware Broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan) {
        throw new ApiError(400, "NO skill plan with Id found")
    }

    const skill = await Skill.findById(skillPlan.skill)


    const {title: skillName, category} = skill

    const {targetLevel, duration, currentDay, completedTopics} = skillPlan

    const todayContent = await generateTopicContent({
        skillName, targetLevel, category, duration, currentDay, completedTopics
    })

    if(completedTopics.includes(todayContent.topic)){
        throw new ApiError(500, "AI returned the topic which is already generated. Please generation again")
    }

    const todayTopic = await DailyTopic.create({
        topic: todayContent.topic,
        description: todayContent.description,
        content: todayContent.content,
        skillPlan: skillPlan._id,
        optionalTip: todayContent.optionalTip,
        day: currentDay
    })

    if(!todayTopic){
        throw new ApiError(500, "Error creating today topic")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, todayTopic, "Today content and topic created successfully")
    )
})


const regenerateTodayTopic = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;
    if(!skillPlanId){
        throw new ApiError(400, "Invalid request - skill plan not found")
    }
    const user = req.user;

    if(!user) {
        throw new ApiError(401, "Auth middleware is broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, "Skill plan not found")
    }

    const skill = await Skill.findById(skillPlan.skill)

    if(!skill) {{
        throw new ApiError(400, "Skill not found")
    }}

    const {title: skillName, category} = skill

    const {targetLevel, currentDay, completedTopics, duration} = skillPlan


    const regenratedContent = await generateTopicContent({
        skillName,
        category,
        targetLevel,
        duration,
        completedTopics,
        currentDay
    })

    await DailyTopic.findOneAndDelete({
        skillPlan: skillPlan._id,
        day: currentDay
    })

    const regenrateTodayTopic = await DailyTopic.create({
        day: currentDay,
        topic: regenratedContent.topic,
        description: regenratedContent.description,
        content: regenratedContent.content,
        generatedAt: new Date(),
        optionalTip: regenratedContent.optionalTip,
        isRegenrated: true,
        skillPlan: skillPlanId
    })

    if(!regenrateTodayTopic){
        throw new ApiError(500, "Error regenrating today topic")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, regenrateTodayTopic, "Today topic regenerated successfully")
    )
})

const getAllLearnedTopics = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "skill plan id not found")
    }

    const user = req.user

    if(!user) {
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, "Bad request - skill plan not found ")
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised request - can't access the learned topics")
    }

    const completedTopic = skillPlan.completedTopics

    if(!completedTopic.length){
        throw new ApiError(500, "No topics has been completed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, completedTopic, "Learned topics fetched")
    )
})


const getTodayTopic = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "topic id not found")
    }
    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, 'Skill plan not found')
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised access - can't access other's plan")
    }

    const todayTopic = await DailyTopic.findOne({
        skillPlan: skillPlanId,
        day: skillPlan.currentDay
    })

    if(!todayTopic){
        throw new ApiError(500, "Error getting todays topic")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, todayTopic, "Today content fetched successfully")
    )

})


const getAllTopicsForPlan = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;
    if(!skillPlanId){
        throw new ApiError(400, "skill plan id not found")
    }
    const user = req.user;

    if(!user){
        throw new ApiError(400, "auth middleware broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlanId){
        throw new ApiError(400, "Bad request - no skill plan found ")
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised access - can't access the plan")
    }

    const allTopic = await DailyTopic.find({
        skillPlan: skillPlanId
    })

    if(!allTopic.length && !allTopic){
        throw new ApiError(500, "No topic found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, allTopic, "All topics and data fetched successfully"
        )
    )
})

const deleteTodayTopic = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, "skill plan not found")
    }

    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised access - can't access others plan")
    }

    const deletedTopic = await DailyTopic.findOneAndDelete({
        skillPlan: skillPlanId,
        day: skillPlan.currentDay
    })

    if(!deletedTopic){
        throw new ApiError(404, "No topic found to delete")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedTopic, "Deleted todays topic")
    )
})


const getTopicByDay = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    const {day}  = req.query;

    if(!day){
        throw new ApiError(400, "Day is not provided")
    }

    if(!skillPlanId){
        throw new ApiError(400, "skill plan id not found")
    }

    const user = req.user

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400, "skill plan not found")
    }
    if(!skillPlan.user.equals(user._id)){
        throw new ApiError(401, "Unauthorised access - can't access other skill plan")
    }

    const topicOfDay = await DailyTopic.findOne({
        skillPlan: skillPlanId,
        day: day
    })

    if(!topicOfDay){
        throw new ApiError(400, "topic not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, topicOfDay, `Topic of day ${day} fetched successfully`)
    )


})


export {
    getAllLearnedTopics,
    getAllTopicsForPlan,
    createDailyTopic,
    getTodayTopic,
    regenerateTodayTopic,
    getTopicByDay,
    deleteTodayTopic
}