import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {
  attendanceRoutes,
  courseRoutes,
  gradeRoutes,
  settingRoutes,
  studentRoutes,
  subjectRoutes,
  teacherRoutes,
} from "./routes/all.routes.js";

const app = express();
//for json data parsing
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true, //!object inside objects, like nesting
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

//!route declaration
//? auth is not assigned
app.use("/api/attendance", attendanceRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api", teacherRoutes);

export { app };

/*
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
//!JSON data accepts
app.use(
  express.json({
    limit: "16kb",
  })
);
//!URL data accept
app.use(
  express.urlencoded({
    extended: true, //!object inside objects, like nesting
    limit: "16kb",
  })
);

//!storing file in folder like public assest in public folder
app.use(express.static("public"));

//! from server access the cookies and perform crud operations
//?secure cookie in browser
app.use(cookieParser());
*/
