import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createSkill } from "../controllers/skill.controller.js";

const router = Router()

router.route("/create-skill").post(
    verifyJwt,
    createSkill
)


export default router;