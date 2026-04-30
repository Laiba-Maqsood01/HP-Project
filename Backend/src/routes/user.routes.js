import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as userController from "../controllers/user.controller.js"

const router = Router();


// user request for instructor role
router.post(
    "/request-instructor",
    authMiddleware,
    authorizeRoles("student"),
    userController.requestInstructor
)

export default router