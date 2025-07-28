import { Router } from "express";
import { verifyJwt } from '../middlewares/auth.middleware.js'
import { completeCurrentDay, createSkillPlan, getAllSkillPlans, getSkillPlanById } from "../controllers/skillPlan.controller";

const router = Router()


router.route('/c/:skillId/create-skill-plan').post(
    verifyJwt,
    createSkillPlan
)

router.route('/c/:skillPlanId/get-skill-plan').get(
    verifyJwt, 
    getSkillPlanById
)

router.route('/c/get-skill-plans').get(
    verifyJwt,
    getAllSkillPlans
)

router.route('/c/:skillPlanId/complete-current-day').patch(
    verifyJwt,
    completeCurrentDay
)



export default router;