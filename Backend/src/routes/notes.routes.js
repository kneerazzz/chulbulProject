import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteNote, getAllNotes, getNotesByDay, updateNote } from "../controllers/notes.controller.js";

const router = Router()

router.route("/c/:skillPlanId/get-note").get(
    verifyJwt,
    getNotesByDay
)

router.route("/c/:skillPlanId/get-all-notes").get(
    verifyJwt,
    getAllNotes
)

router.route("/c/:skillPlanId/update-note").patch(
    verifyJwt,
    updateNote
)

router.route("/c/:skillPlanId/delete-note").delete(
    verifyJwt,
    deleteNote
)

export default router