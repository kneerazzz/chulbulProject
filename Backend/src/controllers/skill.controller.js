import mongoose, { mongo } from "mongoose";
import { Skill } from "../models/skill.model.js";
import { SkillPlan } from "../models/skillPlan.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateSkillDescription from "../utils/generateSkillDescription.js";
import generateSkillLevel from "../utils/generateSkillLevel.js";

const createSkill = asyncHandler(async(req, res) => {
    const {title, category } = req.body

    if(!title || !category){
        throw new ApiError(400, "Title or Category field is empty")
    }


    const user  = req.user;

    if(!req.user){
        throw new ApiError(401, "auth middleware is broken or user not found")
    }


    const existingSkill = await Skill.findOne({
        title: title.trim(),
        createdBy: user._id,
        category: category.trim().toLowerCase(),
    })

    if(existingSkill){
        throw new ApiError(400, "Skill already exists")
    }
    let level;

    if(!level){
        level = await generateSkillLevel({
            skillName: title,
            category: category
        })
    }

    const description = await generateSkillDescription(`${title} of category ${category}`, level)

    const skill = await Skill.create({
        title: title.trim(),
        createdBy: user._id,
        level: level.trim(),
        category: category.trim().toLowerCase(),
        description: description
    })

    if(!skill) {
        throw new ApiError(500, "Error creating skill")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, skill, "Skill set is created successfully")
    )
})

const getAllSkillsForUser = asyncHandler(async(req, res) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401, "auth middleware is broken - user not found")
    }

    const skills = await Skill.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                category: 1,
                level: 1,
                createdBy: 1,
            }
        }
    ])

    if(!skills.length){
        throw new ApiError(400, "No skills present")
    }

    return res
    .status(200)
    .json(
         new ApiResponse(200, skills, "All user skills fetched successfully")
    )
})

const getSkillById = asyncHandler(async(req, res) => {
    const {skillId} = req.params;

    const user = req.user;
    if(!user){
        throw new ApiError(401, "Auth middleware is broken - user not found")
    }

    if(!skillId){
        throw new ApiError(400, "Skill id not present")
    }

    const skill = await Skill.findOne({
        _id: skillId,
        createdBy: user._id
    })


    if(!skill){
        throw new ApiError(400, "Invalid skill Id - No skills with this id found")
    }

    const skillPlan = await SkillPlan.findOne({
        user: user._id,
        skill: skillId
    })

    if(!skillPlan){
        return res
        .status(200)
        .json(
            new ApiResponse(200, {skill: skill, skillPlan: skillPlan}, "Skill fetched successfully")
        )
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, {skill: skill, skillPlan: skillPlan}, "Skill fetched successfully")
    )
})

const updateSkill = asyncHandler(async(req, res) => {
    const {skillId} = req.params
    const {title, level, category} = req.body

    if(!skillId){
        throw new ApiError(400, "Skill Id is required")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(401, "auth middleware is broken - user not found")
    }
    const skill = await Skill.findById(skillId)

    if(!skill) {
        throw new ApiError(400, "Skill does not exist in the database")
    }

    if(!skill.createdBy.equals(user._id)){
        throw new ApiError(403, "Unauthorised access to the skill")
    }
    let description;
    if(title){
        description = await generateSkillDescription(title)
    }

    const updatedSkill = await Skill.findByIdAndUpdate(skillId, {
        $set: {
            title: title || skill.title,
            description: description || skill.description,
            level: level || skill.level,
            category: category || skill.category
        }
    }, {new: true})


    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedSkill, "Skills updated successfully" )
    )
})

const deleteSkill = asyncHandler(async(req, res) => {
    const {skillId} = req.params;

    if(!skillId){
        throw new ApiError(400, "invalid request - skill id not found")
    }

    const user = req.user

    if(!user) {
        throw new ApiError(401, "auth middleware broken - user not found")
    }

    const skill = await Skill.findById(skillId)

    if(!skill){
        throw new ApiError(400, "No skill with this Id")
    }

    if(!skill.createdBy.equals(user._id)){
        throw new ApiError(403, "Unauthorised request - request can't be fulfilled")
    }

    await Skill.findByIdAndDelete(skillId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Skill deleted successfully")
    )


})

export {
    createSkill,
    getAllSkillsForUser,
    getSkillById,
    updateSkill,
    deleteSkill,
}