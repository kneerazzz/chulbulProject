import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js';


export const verifyJwt = asyncHandler(async(req, res, next) => {
    try {

        const token = req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ", "").trim();

        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new ApiError(401, "Invalid access token")
        }
        req.user = user;

        console.log("Cookies:", req.cookies);
        console.log("Headers:", req.headers.authorization);
        console.log("Params:", req.params);


        next();
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
        
    }

})