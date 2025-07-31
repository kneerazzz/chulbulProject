import { AiHistory } from "../models/aiHistory.model.js";
import { SkillPlan } from "../models/skillPlan.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAiHistory = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    const {skillPlanId} = req.query;

    if(!skillPlanId){
        throw new ApiError(400, "Skill plan id not found")
    }

    const skillPlan = await SkillPlan.findById(skillPlanId)

    if(!skillPlan){
        throw new ApiError(400,"Skill plan not found")
    }

    const aiHistory = await AiHistory.find({
        user: user._id,
        skillPlan: skillPlanId
    }).sort({day: 1})

    if(!aiHistory){
        throw new ApiError(401, "Ai history not found for the skill plan - unwuthorised access")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, aiHistory, "AI history fetched successfully")
    )
})

const deleteAiHistory = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "user not found - auth middleware broken")
    }

    const deletedHistory = await AiHistory.deleteMany({
        user: user._id,
        skillPlan: skillPlanId
    })

    if(!deletedHistory){
        throw new ApiError(401, "Unauthorised access - can't access others history")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Ai history deleted successfully")
    )
})


export {
    getAiHistory,
    deleteAiHistory
}