import * as adminService from "../services/admin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// get all users 
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await adminService.getAllUsers();

    res.status(200).json(
        new ApiResponse(200, "Users fetched successfully", users)
    );
});

// delete a user
export const deleteUser = asyncHandler(async (req, res) => {

    // Just to ensure that admin can't delete itself
    if (req.user._id.toString() === req.params.id) {
        throw new ApiError(400, "Admin cannot delete himself");
    }

    await adminService.deleteUser(req.params.id);

    res.status(200).json(
        new ApiResponse(200, "User deleted successfully")
    );
});

// Instructor approval
export const approveInstructor = asyncHandler(async (req, res) => {
    const user = await adminService.approveInstructor(req.params.id);

    res.status(200).json(
        new ApiResponse(200, "Instructor approved", user)
    );
});

// reject instructor
export const rejectInstructor = asyncHandler(async (req, res) => {
    const user = await adminService.rejectInstructor(req.params.id);

    res.status(200).json(
        new ApiResponse(200, "Instructor rejected", user)
    );
});

// view all coures
export const getAllCoursesAdmin = asyncHandler(async (req, res) => {
    const courses = await adminService.getAllCoursesAdmin();

    res.status(200).json(
        new ApiResponse(200, "Courses fetched successfully", courses)
    );
});

// for analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getAnalytics(req.query.range);

  res.status(200).json(
    new ApiResponse(200, "Analytics fetched", data)
  );
});

// Delete course
export const deleteCourseAdmin = asyncHandler(async (req, res) => {
  await adminService.deleteCourseAdmin(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Course deleted successfully")
  );
});

// admin toggle
export const toggleCoursePublish = asyncHandler(async (req, res) => {
  const course = await adminService.toggleCoursePublish(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Publish status updated", course)
  );
});

export const toggleFeaturedCourse = asyncHandler(async (req, res) => {
  const course = await adminService.toggleCourseFeatured(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Course featured status updated", course)
  );
});