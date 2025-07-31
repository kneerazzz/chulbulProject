import { DailyTopic } from "../models/dailyTopic.model.js";
import { Notes } from "../models/notes.model.js";
import { SkillPlan } from "../models/skillPlan.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const skillPlansSummary = asyncHandler(async(req, res) => {
    const user = req.user

    if(!user){
        throw new ApiError(400, "user not found")
    }

    const skillPlans = await SkillPlan.find({
        user: user._id,
        isCompleted: false
    }).populate("skill")


    const summarises = await Promise.all(
        skillPlans.map(async (plan) => {
            const todayTopic = await DailyTopic.findOne({
                skillPlan: plan._id,
                day: plan.currentDay
            });

            const todayNote = await Notes.findOne({
                user: user._id,
                skillPlan: plan._id,
                day: plan.currentDay
            });

            const isTodayDone = plan.completedDays.includes(plan.currentDay);

            return {
                skillPlanId: plan._id,
                skillTitle: plan.skill.title,
                currentDay: plan.currentDay,
                daysLeft: plan.durationInDays - plan.currentDay,
                durationInDays: plan.durationInDays,
                progressPercent: Math.floor((plan.completedDays.length / plan.durationInDays) * 100),
                isTodayDone,
                todayTopic: todayTopic?.topic || "Topic not generated yet",
                lastDeliveredNote: plan.lastDeliveredNote,
                todayNote: todayNote?.content || null,
                streak: {
                    currentStreak: user.streak,
                    longestStreak: user.longestStreak
                }
            };
        })
    );


    return res
    .status(200)
    .json(
        new ApiResponse(200, summarises, "Skill plans fetched")
    )
})

export {
    skillPlansSummary
}

