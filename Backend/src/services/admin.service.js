import userModel from "../models/user.model.js";
import courseModel from "../models/course.model.js";
import enrollmentModel from "../models/enrollment.model.js"
import { ApiError } from "../utils/apiError.js";

// get all users 
export async function getAllUsers() {
  return await userModel.find().select("-password");
}

// delete users
export async function deleteUser(userId) {
  const user = await userModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }


  await user.deleteOne();
}

// approve student --> instructor
export async function approveInstructor(userId) {
  const user = await userModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.instructorRequest !== "pending") {
    throw new ApiError(400, "No pending request");
  }

  user.role = "instructor";
  user.instructorRequest = "approved";
  await user.save();

  return user;
}

// rejection student --> instructor 
export async function rejectInstructor(userId) {
  const user = await userModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.instructorRequest !== "pending") {
    throw new ApiError(400, "No pending request");
  }

  user.instructorRequest = "rejected";
  await user.save();

  return user;
}

// get all courses (ADMIN VIEW)
export async function getAllCoursesAdmin() {
  return await courseModel.find().populate("instructor", "username email");
}

// get count of everything
export async function getAnalytics(range) {

  const days = parseInt(range) || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const totalUsers = await userModel.countDocuments();
  const totalCourses = await courseModel.countDocuments();
  const totalStudents = await userModel.countDocuments({ role: "student" });
  const totalInstructors = await userModel.countDocuments({ role: "instructor" });
  const totalEnrollments = await enrollmentModel.countDocuments();

  // ================= GROWTH =================

  const userGrowth = await userModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }   
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" }, 
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const courseGrowth = await courseModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const enrollmentGrowth = await enrollmentModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    totalUsers,
    totalCourses,
    totalStudents,
    totalInstructors,
    totalEnrollments,
    userGrowth,
    courseGrowth,
    enrollmentGrowth
  };
}
// Delete Course
export async function deleteCourseAdmin(courseId) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // delete enrollments
  await enrollmentModel.deleteMany({ course: courseId });

  // delete course
  await course.deleteOne();

  return true;
}

// Admin course publish toggle 
export async function toggleCoursePublish(courseId) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  course.isPublished = !course.isPublished;
  await course.save();

  return course;
}

// featured toggle
export async function toggleCourseFeatured(courseId) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  course.isFeatured = !course.isFeatured;
  await course.save();

  return course;
}