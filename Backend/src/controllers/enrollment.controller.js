import * as enrollmentService from "../services/enrollment.service.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import  { ApiResponse } from "../utils/apiResponse.js";

// ENROLL COURSE
export const enrollCourse = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollCourse(
    req.user._id,
    req.params.courseId
  );

  res.status(201).json(
    new ApiResponse(201, "Enrolled successfully", enrollment)
  );
});

// MY COURSES
export const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await enrollmentService.getMyCourses(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "My courses fetched successfully", courses)
  );
});

// Mark as completed and track progress also
export const completeLesson = asyncHandler(async (req, res) => {
  const { enrollmentId, lessonId } = req.body;

  const enrollment = await enrollmentService.completeLesson(
    enrollmentId,
    lessonId
  );

  res.status(200).json(
    new ApiResponse(200, "Lesson marked complete", {
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      completed: enrollment.completed
    })
  );
});