import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import * as userService from "../services/user.service.js";

export const requestInstructor = asyncHandler(async(req, res)=>{
    
    const userId = req.user._id;

    await userService.requestInstructorService(userId);

    res.status(200).json(
        new ApiResponse(200, "Instructor request submitted successfully")
    )
})