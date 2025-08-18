import { Notes } from "../models/notes.model.js";
import { SkillPlan } from "../models/skillPlan.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createNote = asyncHandler(async(req, res) => {
    const {day} = req.query
    const {skillPlanId} = req.params
    const {notesContent} = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();


    if(!day || !skillPlanId){
        throw new ApiError("Day or skillPlanId not found", 400)
    }
    const user = req.user

    if(!user){
        throw new ApiError("Unauthorised - can't find user")
    }

    const skillPlan = await SkillPlan.findOne({
        user: user._id,
        _id: skillPlanId
    })

    let createdNote;

    if(notesContent){
        createdNote = await Notes.create({
            user: user._id,
            skill: skillPlan.skill,
            skillPlan: skillPlanId,
            content: notesContent,
            day: skillPlan.currentDay
        })
    }
    if(!createdNote){
        throw new ApiError("Error creating note", 500)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdNote, "Note has been created successfully")
    )  
})

const getNotesByDay = asyncHandler(async(req, res) => {
    const {day} = req.query;

    const {skillPlanId} = req.params;


    if(!skillPlanId){
        throw new ApiError(400, "Skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    if(!day){
        throw new ApiError(400, "No day query found")
    }

    const note = await Notes.findOne({
        user: user._id,
        skillPlan: skillPlanId,
        day: day
    })

    if(!note){
        throw new ApiError(500, "No note found!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, note, "Note fetched successfully")
    )
})


const getAllNotes = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    if(!skillPlanId){
        throw new ApiError(400, "Skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }

    const notes = await Notes.find({
        user: user._id,
        skillPlan: skillPlanId
    })

    if(!notes || !notes.length){
        throw new ApiError(400, "No notes found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, notes, "All notes fetched successfully")
    )
})

const updateNote = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    const {day} = req.query;

    const {content} = req.body;
    if(!day){
        throw new ApiError(400, "Day query not found!")
    }
    if(!skillPlanId){
        throw new ApiError(400, "Skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }  

    if(!content){
        throw new ApiError(400, "Nothing to update in the notes")
    }

    const updatedNote = await Notes.findOneAndUpdate({
        user: user._id,
        day: day,
        skillPlan: skillPlanId
    }, {
        $set: {
            content: content
        }
    }, {new: true})

    if(!updatedNote){
        throw new ApiError(400, "erro updaing the note - can't find note")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedNote, "Note has been updated successfully")
    )
})


const deleteNote = asyncHandler(async(req, res) => {
    const {skillPlanId} = req.params;

    const {day} = req.query;

    if(!day){
        throw new ApiError(400, "Day query not found!")
    }
    if(!skillPlanId){
        throw new ApiError(400, "Skill plan id not found")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(400, "Auth middleware is broken - user not found")
    }  

    const deletedNote = await Notes.findOneAndDelete({
        user: user._id,
        skillPlan: skillPlanId,
        day: day
    })

    if(!deletedNote){
        throw new ApiError(500, "Error deleting note")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Note deleted successfully")
    )
})


export {
    createNote,
    getNotesByDay,
    getAllNotes,
    updateNote,
    deleteNote
}