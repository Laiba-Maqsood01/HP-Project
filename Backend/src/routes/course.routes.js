// here courses will be created, edited and deleted, as it all will be done by instructor so we can say instructor's routes

import { Router } from "express";
import * as courseController from "../controllers/course.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { lessonSchema } from "../validations/course.validation.js";
import { createCourseSchema, updateCourseSchema} from "../validations/course.validation.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();


// public
// GET /api/courses/
router.get(
    "/",
    courseController.getAllCourses);

// GET /api/courses/:id
router.get(
    "/:id",
    courseController.getCourseById);

// Instructor only

// POST /api/courses/
router.post(
  "/",
  authMiddleware,
  authorizeRoles("instructor"),
  upload.single("thumbnail"),
  validate(createCourseSchema),
  courseController.createCourse
);


// PUT /api/courses/:id
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("instructor"),
  upload.single("thumbnail"),
  validate(updateCourseSchema),
  courseController.updateCourse
);

// DELETE /api/courses/:id
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("instructor"),
  courseController.deleteCourse
);

// POST /api/courses/:id/lesson  to add lesson in course.
router.post(
  "/:id/lesson",
  authMiddleware,
  authorizeRoles("instructor"),
  upload.single("video"),
  validate(lessonSchema), 
  courseController.addLesson
);

// PUT ( because we have change isPublished to true) /api/courses/:id/publish 
router.put(
  "/:id/publish",
  authMiddleware,
  authorizeRoles("instructor"),
  courseController.togglePublishCourse
);

// GET /api/courses/instructor/my-courses 
router.get(
  "/instructor/my-courses",
  authMiddleware,
  authorizeRoles("instructor"),
  courseController.getMyCoursesInstructor
);

// GET /api/courses/instructor/stats
router.get(
  "/instructor/stats",
  authMiddleware,
  authorizeRoles("instructor"),
  courseController.getInstructorStats
);

export default router;
