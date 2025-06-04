import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import globalErrorHandler from "./middleware/globalError.middleware.js";

const app = express();

//⭐ data parsing
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    //⭐ object inside objects, like nesting
    extended: true,
    limit: "16kb",
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(cookieParser());

// ⭐ Routes setup
import {
  attendanceRoutes,
  courseRoutes,
  gradeRoutes,
  settingRoutes,
  studentRoutes,
  subjectRoutes,
  teacherRoutes,
} from "./routes/app.routes.js";

// ⭐Block all routes that don't start with /website/api
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only API routes are allowed.",
    });
  }
  next();
});

app.use("/api/attendance", attendanceRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teacher", teacherRoutes);

//⭐ No endpoint route block
// app.all("/api/*", (req, res, next) => {
//   const err = new Error(`Cannot find ${req.originalUrl} on this server.`);
//   err.statusCode = 404;
//   err.status = "fail";
//   next(err);
// });

//⭐ global error handler
app.use(globalErrorHandler);

export { app };
