import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { skillPlansSummary } from "../controllers/dashboard.controller.js";

const router = Router()

router.route("/dashboard").get(
    verifyJwt,
    skillPlansSummary
)



export default router