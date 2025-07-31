import { Router } from "express";
import { verifyJwt } from '../middlewares/auth.middleware.js'
import { completeCurrentDay, createSkillPlan, getAllSkillPlans,deleteSkillPlan, getSkillPlanById, updateSkillPlan, getSkillPlanProgress } from "../controllers/skillPlan.controller.js";

const router = Router()


router.route('/c/:skillId/create-skill-plan').post(
    verifyJwt,
    createSkillPlan
)

router.route('/c/:skillPlanId/get-skill-plan').get(
    verifyJwt, 
    getSkillPlanById
)

router.route('/get-skill-plans').get(
    verifyJwt,
    getAllSkillPlans
)

router.route('/c/:skillPlanId/complete-current-day').patch(
    verifyJwt,
    completeCurrentDay
)

router.route("/c/:skillPlanId/update-skill-plan").patch(
    verifyJwt,
    updateSkillPlan
)

router.route("/c/:skillPlanId/delete-skill-plan").delete(
    verifyJwt,
    deleteSkillPlan
)

router.route("/c/:skillPlanId/get-progress").get(
    verifyJwt,
    getSkillPlanProgress
)



export default router;