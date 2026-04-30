import {ApiError} from "../utils/apiError.js";
import userModel from "../models/user.model.js";

export const requestInstructorService  = async(userId) =>{
    const user = await userModel.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    if(user.role === "instructor"){
        throw new ApiError(400, "You are already an instructor")
    }

    if(user.instructorRequest === "pending"){
        throw new ApiError(400, "Request already pending")
    }

    if(user.instructorRequest === "approved"){
        throw new ApiError(400, "Already approved as instructor")
    }

    user.instructorRequest = "pending";
    await user.save();

    return user;
}