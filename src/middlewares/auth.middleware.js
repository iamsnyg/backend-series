import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next)=>{
    try {
            const token=req.cookies?.accessToken || req.header("Authorizaion")?.replace("Bearer ", "");
        
            if(!token){
                throw new ApiError(401, "Unauthorized request");
            }
        
            const decodedTokenJWT=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
            const user=await User.findById(decodedTokenJWT?._id).select("-password -refreshToken")
        
            if(!user){
                throw new ApiError(401,  "Unauthorized request")
            }
        
            req.user=user;
        
            next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
        
    }
})