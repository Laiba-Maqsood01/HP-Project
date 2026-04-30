import enrollmentModel from "../models/enrollment.model.js";
import courseModel from "../models/course.model.js";
import { ApiError } from "../utils/apiError.js";

// enrolling in course
export async function enrollCourse(studentId, courseId) {

  // check course exists
  const course = await courseModel.findById(courseId);

  if (!course || !course.isPublished) {
    throw new ApiError(404, "Course not found or not available");
  }

  // checkng duplicate enrollment
  const existing = await enrollmentModel.findOne({
    student: studentId,
    course: courseId,
  });

  if (existing) {
    throw new ApiError(400, "Already enrolled in this course");
  }

  const enrollment = await enrollmentModel.create({
    student: studentId,
    course: courseId,
  });

  return enrollment;
}

// my courses
export async function getMyCourses(studentId) {
  return await enrollmentModel
    .find({ student: studentId })
    .populate("course")
    .populate("student", "username email");
}


export async function completeLesson(enrollmentId, lessonId) {
  const enrollment = await enrollmentModel.findById(enrollmentId);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  const course = await courseModel.findById(enrollment.course);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const totalLessons = course.lessons.length;

  // check lesson exists
  const lessonExists = course.lessons.some(
    (lesson) => lesson._id.toString() === lessonId
  );

  if (!lessonExists) {
    throw new ApiError(404, "Lesson not found in this course");
  }

  const alreadyCompleted = enrollment.completedLessons.some(
    (id) => id.toString() === lessonId
  );

  if (!alreadyCompleted) {
    enrollment.completedLessons.push(lessonId);
  }

  //  update progress
  enrollment.progress =
    (enrollment.completedLessons.length / totalLessons) * 100;

  //  mark completed
  if (enrollment.completedLessons.length === totalLessons) {
    enrollment.completed = true;
  }

  await enrollment.save();

  return enrollment;
}