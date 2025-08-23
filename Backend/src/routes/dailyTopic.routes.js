import {Router} from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { deleteTodayTopic, ensureDailyTopic, getAllLearnedTopics, getAllTopicsForPlan, getTopicByDay, regenerateTodayTopic } from '../controllers/dailyTopic.controller.js';
import { geminiLimiter } from '../middlewares/geminiLimiter.js';

const router = Router()


router.route("/c/:skillPlanId/create-topic").get(
    verifyJwt,
    ensureDailyTopic
)

router.route("/c/:skillPlanId/regenrate-topic").get(
    verifyJwt,
    geminiLimiter,
    regenerateTodayTopic
)

router.route("/c/:skillPlanId/get-learned-topics").get(
    verifyJwt,
    getAllLearnedTopics
)

router.route("/c/:skillPlanId/get-all-topics").get(
    verifyJwt,
    getAllTopicsForPlan
)

router.route("/c/:skillPlanId/delete-topic").delete(
    verifyJwt,
    deleteTodayTopic
)

router.route("/c/:skillPlanId/get-topic").get(
    verifyJwt,
    getTopicByDay
)

export default router;