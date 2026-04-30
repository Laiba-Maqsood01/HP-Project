import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// ALL ROUTES ADMIN ONLY
router.use(
    authMiddleware,
    authorizeRoles("admin"));

// USERS
router.get(
    "/users",
    adminController.getAllUsers);


router.delete(
    "/users/:id",
    adminController.deleteUser);

// INSTRUCTOR REQUESTS
router.put("/approve-instructor/:id",
    adminController.approveInstructor);

// rejecr
router.put("/reject-instructor/:id",
    adminController.rejectInstructor);

// COURSES
router.get(
    "/courses",
    adminController.getAllCoursesAdmin);

// It will get analytics
router.get(
    "/analytics",
    adminController.getAnalytics);

// delete course
router.delete(
    "/courses/:id",
    adminController.deleteCourseAdmin
);

// toggle publish/unpublish
router.put(
    "/courses/:id/toggle-publish",
    adminController.toggleCoursePublish
);

router.put(
  "/courses/:id/featured",
  adminController.toggleFeaturedCourse
);
export default router;