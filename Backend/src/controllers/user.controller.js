import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/fileUpload.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try{

        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }catch(error){
        console.log("Error generating tokens")
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const {email, password, fullname, username, bio, interests, skillLevel} = req.body;

    if(
        [fullname, email, username, password].some((index) => 
            index?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    if(interests.length === 0){
        throw new ApiError(400, "interest field is required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser) {
        throw new ApiError(400, "User with similar username or email already exist")
    }

    const profilePicLocalPath = req.file?.path;
    let profilePic;
    if(profilePicLocalPath){
        profilePic = await uploadOnCloudinary(profilePicLocalPath)

    }

    const user = await User.create({
        username: username.toLowerCase(),
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

const loginUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body;

    if(!username && !email) {
        throw new ApiError(401, "Field is required!")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user){
        throw new ApiError(400, "User with this username or email doesn't exist")
    }

    const isMatch = await user.isPasswordCorrect(password)

    if(!isMatch){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }),
        "user Login successfull"
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    const user = req.user;
    if(!user){
        throw new ApiError(401, "Unauthorised request")
    }
    await User.findByIdAndUpdate(user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true
    }


    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "Logout successful")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
}