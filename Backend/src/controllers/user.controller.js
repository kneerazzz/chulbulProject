import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/fileUpload.js";
import deleteFromCloudinary from "../utils/fileDelete.js";
import jwt from 'jsonwebtoken'
import { recommendedSkills as skillsMap } from "../utils/recommendedSkills.js";
import validator from 'validator'
import { sendEmail } from "../utils/email.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try{

        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

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

    if(!validator.isEmail(email)){
        throw new ApiError(400, "Invalid email address")
    }

    if(!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
    })){
        throw new ApiError(400, "Password is not strong enough. Please change password")
    }

    if(username.trim().length < 4){
        throw new ApiError(400, "Username should be bigger than 4 letters")
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

    let recommendations = [];

    if(interests && interests.length > 0){
        recommendations = [...new Set(
            interests.flatMap(domain => skillsMap[domain] || [])
        )]
    }


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user")
    }

    await sendEmail({
        to: createdUser.email,
        subject: "Account creation rat",
        text: `Congratulations ${createdUser.fullname}, you have officially joined rats`,
        html: `<h1>Congratulations!</h1><p>On joinging rats <strong>${createdUser.fullname}</strong></p>`
    })


    return res
    .status(200)
    .json(
        new ApiResponse(200, {user: createdUser, recommendedSkills: recommendations}, "User registered successfully")
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
        "user Logged In Successfully"
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
        new ApiResponse(200, {}, "User Logged out successfully")
    )
})

const getUserDetails = asyncHandler(async(req, res) => {
    const user = req.user;
    if(!user) {
        throw new ApiError(401, "Invalid request")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User Details fetched successfully")
    )
})

const updateUserDetails = asyncHandler(async(req, res) =>{
    const {username, fullname, bio, interests} = req.body

    if(!username && !fullname && !bio && !interests){
        throw new ApiError(400, "Nothing to update here")
    }

    if(username && username.toLowerCase() !== req.user?.username){
        const existingUser = await User.findOne({username: username})

        if(existingUser){
            throw new ApiError(400, "user with this username already exist")
        }

    }

    if(username){
        username = username.trim().toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            username: username || req.user.username,
            fullname: fullname || req.user.fullname,
            bio: bio || req.user.bio,
            interests: interests || req.user.interests
        }
    }, {new: true}).select("-password -refreshToken")

    let recommendations = [];

    if(interests && interests.length > 0){
        recommendations = [...new Set(
            interests.flatMap(domain => skillsMap[domain] || [])
        )]
    }

    if(!user){
        throw new ApiError(500, "something went wrong while updating details")
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User Details updated successfully")
    )

})


const updatePassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;

    if(!oldPassword || !newPassword || !confirmPassword){
        throw new ApiError(401, "Field can't be empty")
    }

    const user = req.user;

    if(!user){
        throw new ApiError(401, "Invalid credentials")
    }

    const isMatch = await user.isPasswordCorrect(oldPassword)

    if(!isMatch){
        throw new ApiError(401, "Password not correct")
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(401, "Password do not match!")
    }

    user.password = newPassword;

    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Password changed successfully")
    )

})

const updateProfilePic = asyncHandler(async(req, res) => {
    const profilePicLocalPath = req.file?.path;

    if(!profilePicLocalPath){
        throw new ApiError(401, "Invalid request")
    }
    const user = req.user;


    const profilePic = await uploadOnCloudinary(profilePicLocalPath)

    if(profilePic.url === ""){
        throw new ApiError(500, "Error uploading profile pic")
    }

    if(user.profilePic && !user.profilePic.includes("https://res.cloudinary.com/dmrf8lhcf/image/upload/v1753587887/unc_rt6eou.jpg")){
        await deleteFromCloudinary(user.profilePic)
    }

    user.profilePic = profilePic.url;

    await user.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            user: user.profilePic
        }, "Profile pic updated successfully")
    )
})

const refreshAcessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)

        if(!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used!")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: true})

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {}, "Access token refreshed successfully!")
        )
        
    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid refresh token")
        
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    updateUserDetails,
    updatePassword,
    updateProfilePic,
    refreshAcessToken
}