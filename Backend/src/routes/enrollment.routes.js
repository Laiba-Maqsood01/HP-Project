import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as enrollmentController from "../controllers/enrollment.controller.js";

const router = Router();

// STUDENT ONLY

// my courses
// GET /api/enrollments/my-courses
router.get(
  "/my-courses",
  authMiddleware,
  authorizeRoles("student"),
  enrollmentController.getMyCourses
);

// it will mark leson as completed and track progress
// POST /api/enrollments/complete-lesson
router.post(
  "/complete-lesson",
  authMiddleware,
  authorizeRoles("student"),
  enrollmentController.completeLesson
);

// enroll in course
// POST /api/enrollments/:courseId with Authorization Bearer <Access Token>
router.post(
  "/:courseId",
  authMiddleware,
  authorizeRoles("student"),
  enrollmentController.enrollCourse
);


export default router;