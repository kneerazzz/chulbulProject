import { SkillPlan } from "../models/skillPlan.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateTopicContent from "../utils/generateContent.js";
import { Skill } from "../models/skill.model.js";
import { DailyTopic } from "../models/dailyTopic.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AiHistory } from "../models/aiHistory.model.js";


const ensureDailyTopic = asyncHandler(async (req, res) => {
  const { skillPlanId } = req.params;
  const { day } = req.query;
  const user = req.user;

  if (!skillPlanId || !day) {
    throw new ApiError(400, "Bad request - skillPlanId or day missing");
  }
  if (!user) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  const skillPlan = await SkillPlan.findById(skillPlanId);
  if (!skillPlan) {
    throw new ApiError(404, "No skill plan with this ID found");
  }

  const skill = await Skill.findById(skillPlan.skill);
  if (!skill) {
    throw new ApiError(404, "Skill not found for this plan");
  }

  // 1. check if topic already exists for this day
  const existingTopic = await DailyTopic.findOne({
    skillPlan: skillPlanId,
    day: Number(day),
  });

  if (existingTopic) {
    return res
      .status(200)
      .json(new ApiResponse(200, { id: existingTopic._id, day: existingTopic.day }, `Day ${day} topic already exists`));
  }

  // 2. generate topic if not exists
  const { title: skillName, category } = skill;
  const { targetLevel, duration, completedSubtopics } = skillPlan;

  const todayContent = await generateTopicContent({
    skillName,
    targetLevel,
    category,
    duration,
    currentDay: Number(day),
    completedSubtopics,
  });

  // 3. prevent duplicates
  if (
    completedSubtopics.some(
      (sub) => sub.title.toLowerCase() === todayContent.topic.toLowerCase()
    )
  ) {
    throw new ApiError(
      500,
      "AI returned a topic already completed. Please regenerate."
    );
  }

  // 4. save new topic
  const newTopic = await DailyTopic.create({
    topic: todayContent.topic,
    description: todayContent.description,
    content: todayContent.content,
    skillPlan: skillPlan._id,
    optionalTip: todayContent.optionalTip,
    day: Number(day),
  });

  if (!newTopic) {
    throw new ApiError(500, "Error creating today's topic");
  }

  // 5. log history
  await AiHistory.create({
    user: user._id,
    skillPlan: skillPlanId,
    day: Number(day),
    generatedTopics: [
      {
        title: todayContent.topic,
        generatedAt: new Date(),
        model: "Gemini 1.5 Pro",
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { id: newTopic._id, day: newTopic.day }, `Day ${day} topic created successfully`));
});


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

    const {targetLevel, currentDay, completedSubtopics, duration} = skillPlan


    const regenratedContent = await generateTopicContent({
        skillName,
        category,
        targetLevel,
        duration,
        completedSubtopics,
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

    const completedTopics = skillPlan.completedSubtopics

    if(!completedTopics.length){
        throw new ApiError(500, "No topics has been completed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, completedTopics, "Learned topics fetched")
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
    ensureDailyTopic,
    regenerateTodayTopic,
    getTopicByDay,
    deleteTodayTopic
}