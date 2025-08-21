import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteAiHistory, deleteSingleLog, getAiHistory } from "../controllers/aiHistory.controller.js";

const router = Router()


router.route("/get-ai-history").get(
    verifyJwt,
    getAiHistory
)

router.route("/c/:skillPlanId/delete-ai-history").delete(
    verifyJwt,
    deleteAiHistory
)

router.route("/c/:skillPlanId/delete-single-log").delete(
    verifyJwt,
    deleteSingleLog
)


export default router;