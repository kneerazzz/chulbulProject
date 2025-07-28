import { SkillPlan } from "../models/skillPlan.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import generateTopicContent from "../utils/generateContent";
import { Skill } from "../models/skill.model";


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

    const skillName = skill.title

    const targetLevel = skillPlan.targetLevel

    const category = skill.category

    const duration = skillPlan.durationInDays

    const currentDay = skillPlan.currentDay

    const todayContent = await generateTopicContent({
        skillName, targetLevel, category, duration, currentDay
        
    })








})