import * as courseService from "../services/course.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import imagekit from "../config/imagekit.js";
import courseModel from "../models/course.model.js";
import { Readable } from "stream";


// course creation func.
export const createCourse = asyncHandler(async (req, res) => {
  let thumbnailUrl = "";
  let thumbnailFileId = "";
  // 🔥 1. Upload thumbnail if exists
  if (req.file) {
    const stream = Readable.from(req.file.buffer);

    const uploaded = await imagekit.files.upload({
      file: stream,
      fileName: `course-${Date.now()}-${req.file.originalname}`,
      folder: "/courses",
    });


    thumbnailFileId = uploaded.fileId;
    thumbnailUrl = uploaded.url;

  }

  //  Convert FormData strings to proper types
  const data = {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : undefined,
    thumbnail: thumbnailUrl,
    thumbnailFileId,
  };


  // Create course with cleaned data
  const course = await courseService.createCourse(
    data,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(201, "Course created successfully", course)
  );
});

// get all courses
export const getAllCourses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 9,
    search = "",
    category = "",
    featured,
  } = req.query;

  const result = await courseService.getAllCourses({
    page: Number(page),
    limit: Number(limit),
    search,
    category,
    featured: featured === "true"
  });

  res.status(200).json(
    new ApiResponse(200, "Courses fetched", result)
  );
});

// by id
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Course fetched successfully", course)
  );
});

// update 
export const updateCourse = asyncHandler(async (req, res) => {

  const updateData = { ...req.body };

  //  Get existing course FIRST
  const existingCourse = await courseModel.findById(req.params.id);

  if (!existingCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  //  If new thumbnail uploaded
  if (req.file) {
    const stream = Readable.from(req.file.buffer);

    const uploaded = await imagekit.files.upload({
      file: stream,
      fileName: `course-${Date.now()}-${req.file.originalname}`,
      folder: "/courses",
    });


    //  DELETE OLD IMAGE (IMPORTANT)
    if (existingCourse.thumbnailFileId) {
      try {
        await imagekit.files.delete(existingCourse.thumbnailFileId);
      } catch (err) {
        console.log("Failed to delete old image:", err.message);
      }
    }

    // Save new image
    updateData.thumbnail = uploaded.url;
    updateData.thumbnailFileId = uploaded.fileId;
  }

  const course = await courseService.updateCourse(
    req.params.id,
    req.user._id,
    updateData
  );

  return res.status(200).json(
    new ApiResponse(200, "Course updated successfully", course)
  );
});

// delete
export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(
    req.params.id,
    req.user._id
  );

  res.status(200).json(
    new ApiResponse(200, "Course deleted successfully")
  );
});

// TO add lessons in the course
export const addLesson = asyncHandler(async (req, res) => {
  let videoUrl = "";

  // Upload video if exist
  if (req.file) {
    const stream = Readable.from(req.file.buffer);

    const uploaded = await imagekit.files.upload({
      file: stream,
      fileName: `lesson-${Date.now()}-${req.file.originalname}`,
      folder: "/courses/lessons",
    });


    videoUrl = uploaded.url;
  }
  const course = await courseService.addLesson(
    req.params.id,
    req.user._id,
    {
      ...req.body,
      videoUrl,
    }
  );

  res.status(200).json(
    new ApiResponse(200, "Lesson added", course)
  );
});

// to publish course but the condition is that at least one lesson should be added in it
export const togglePublishCourse = asyncHandler(async (req, res) => {
  const course = await courseService.togglePublishCourse(
    req.params.id,
    req.user._id
  );

  res.status(200).json(
    new ApiResponse(200, "Course published", course)
  );
});

// get all courses of instrcutor only
export const getMyCoursesInstructor = asyncHandler(async (req, res) => {
  const courses = await courseService.getInstructorCourses(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Instructor courses fetched", courses)
  );
});

// get analytics for instructor like how many courses have you published!
export const getInstructorStats = asyncHandler(async (req, res) => {
  const stats = await courseService.getInstructorStats(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Instructor stats fetched", stats)
  );
});