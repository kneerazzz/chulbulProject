import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createSkill, deleteSkill, getAllSkillsForUser, getSkillById, updateSkill } from "../controllers/skill.controller.js";

const router = Router()

router.route("/create-skill").post(
    verifyJwt,
    createSkill
)

router.route("/get-all-skills").get(
    verifyJwt,
    getAllSkillsForUser
)

router.route("/c/:skillId/get-skill").get(
    verifyJwt,
    getSkillById
)

router.route("/c/:skillId/update-skill").patch(
    verifyJwt,
    updateSkill
)

router.route("/c/:skillId/delete-skill").delete(
    verifyJwt,
    deleteSkill
)


export default router;