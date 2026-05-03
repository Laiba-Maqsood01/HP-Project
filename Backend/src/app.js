import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

const app = express()

app.set("trust proxy", 1);

// Rate limiter FIRST (global protection)
app.use(apiLimiter);


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Helmet for securing extra information, like hackers can check our tool(express) then can find the vulnerability and attack our website.
//It's Standard security headers
app.use(helmet());

// express middleware
app.use(express.json());

// morgan middleware for logging
app.use(morgan("dev"));

// use cookieParser
app.use(cookieParser());

// All routes starting with /api/auth
app.use("/api/auth", authRouter)

// user requesting for instructor 
app.use("/api/users", userRouter)

// instructor + public routes
app.use("/api/courses", courseRouter)

// enrollment routes for students
app.use("/api/enrollments", enrollmentRouter)

// admin routes
app.use("/api/admin", adminRouter);

// use global error handler
app.use(errorHandler);

export default app

