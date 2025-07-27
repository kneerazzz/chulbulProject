import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/fileUpload.js";


const registerUser = asyncHandler(async(req, res) => {
    const {email, password, fullname, username, bio, interests, skillLevel} = req.body;

    if(
        [fullname, email, username, password].some((index) => 
            index?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser) {
        throw new ApiError(400, "User with similar username or email already exist")
    }

    const profilePicLocalPath = req.file?.path;

    const profilePic = await uploadOnCloudinary(profilePicLocalPath)

    const user = await User.create({
        username, 
        fullname,
        bio,
        email,
        password, 
        profilePic: profilePic?.url,
        skillLevel,
        interests,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while craating user")
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})


export {
    registerUser,
}