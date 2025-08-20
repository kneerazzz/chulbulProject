import { Notes } from "../models/notes.model.js";
import { SkillPlan } from "../models/skillPlan.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNote = asyncHandler(async (req, res) => {
  const { day } = req.query;
  const { skillPlanId } = req.params;
  const { content } = req.body;

  if (!day || !skillPlanId) {
    throw new ApiError(400, "Day or skillPlanId not found");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  // Check if note already exists
  const existingNote = await Notes.findOne({
    user: user._id,
    skillPlan: skillPlanId,
    day: day
  });

  if (existingNote) {
    throw new ApiError(400, "Note already exists for this day");
  }

  const skillPlan = await SkillPlan.findOne({
    user: user._id,
    _id: skillPlanId
  });

  if (!skillPlan) {
    throw new ApiError(404, "Skill plan not found");
  }

  const createdNote = await Notes.create({
    user: user._id,
    skill: skillPlan.skill,
    skillPlan: skillPlanId,
    content: content,
    day: day
  });

  if (!createdNote) {
    throw new ApiError(500, "Error creating note");
  }

  return res.status(200).json(
    new ApiResponse(200, createdNote, "Note has been created successfully")
  );
});

const getNotesByDay = asyncHandler(async (req, res) => {
  const { day } = req.query;
  const { skillPlanId } = req.params;

  if (!skillPlanId) {
    throw new ApiError(400, "Skill plan id not found");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  if (!day) {
    throw new ApiError(400, "No day query found");
  }

  const note = await Notes.findOne({
    user: user._id,
    skillPlan: skillPlanId,
    day: day
  });

  if (!note) {
    throw new ApiError(404, "No note found for this day");
  }

  return res.status(200).json(
    new ApiResponse(200, note, "Note fetched successfully")
  );
});

const getAllNotes = asyncHandler(async (req, res) => {
  const { skillPlanId } = req.params;

  if (!skillPlanId) {
    throw new ApiError(400, "Skill plan id not found");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  const notes = await Notes.find({
    user: user._id,
    skillPlan: skillPlanId
  });

    if (!notes || notes.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No notes found")
        );
    }
  return res.status(200).json(
    new ApiResponse(200, notes, "All notes fetched successfully")
  );
});

const updateNote = asyncHandler(async (req, res) => {
  const { skillPlanId } = req.params;
  const { day } = req.query;
  const { content } = req.body;

  if (!day) {
    throw new ApiError(400, "Day query not found!");
  }
  if (!skillPlanId) {
    throw new ApiError(400, "Skill plan id not found");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  if (!content) {
    throw new ApiError(400, "Nothing to update in the notes");
  }

  const updatedNote = await Notes.findOneAndUpdate(
    {
      user: user._id,
      day: day,
      skillPlan: skillPlanId
    },
    {
      $set: {
        content: content
      }
    },
    { new: true, runValidators: true }
  );

  if (!updatedNote) {
    throw new ApiError(404, "Note not found - cannot update");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedNote, "Note has been updated successfully")
  );
});

const deleteNote = asyncHandler(async (req, res) => {
  const { skillPlanId } = req.params;
  const { day } = req.query;

  if (!day) {
    throw new ApiError(400, "Day query not found!");
  }
  if (!skillPlanId) {
    throw new ApiError(400, "Skill plan id not found");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  const deletedNote = await Notes.findOneAndDelete({
    user: user._id,
    skillPlan: skillPlanId,
    day: day
  });

  if (!deletedNote) {
    throw new ApiError(404, "Note not found - cannot delete");
  }

  return res.status(200).json(
    new ApiResponse(200, {deleted: true}, "Note deleted successfully")
  );
});

export {
  createNote,
  getNotesByDay,
  getAllNotes,
  updateNote,
  deleteNote
};