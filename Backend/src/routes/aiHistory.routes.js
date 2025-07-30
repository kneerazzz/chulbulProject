import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteAiHistory, getAiHistory } from "../controllers/aiHistory.controller.js";

const router = Router()


router.route("/c/get-history").get(
    verifyJwt,
    getAiHistory
)

router.route("/c/:skillPlanId/delete-history").delete(
    verifyJwt,
    deleteAiHistory
)


export default router;