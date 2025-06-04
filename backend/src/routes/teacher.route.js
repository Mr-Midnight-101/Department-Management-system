// src/routes/teacher.routes.js

import { Router } from "express";
import {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  changePassword,
  getCurrentTeacher,
  updateTeacherDetails,
  updateTeacherAvatar,
  getTeacherById,
  getAllTeachers,
  teacherCount,
} from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const teacherRoutes = Router();
// Route to get the count of all teachers
teacherRoutes.route("/count").get(teacherCount);

// Route to get all teachers
teacherRoutes.route("/").get(getAllTeachers);

// Route for teacher registration with avatar upload middleware
teacherRoutes.route("/register").post(upload.single("avatar"), registerTeacher);

// Route for teacher login
teacherRoutes.route("/login").post(loginTeacher);

//🌟 secure routes
// Route to refresh access token using refresh token
teacherRoutes.route("/refresh-token").post(verifyJWT, refreshAccessToken);

// Route for teacher logout (Requires authentication)
teacherRoutes.route("/logout").post(verifyJWT, logoutTeacher);

// Route to change authenticated teacher's password (Requires authentication)
teacherRoutes.route("/change-password").patch(verifyJWT, changePassword);

// Route to get authenticated teacher's current details (Requires authentication)
teacherRoutes.route("/user").get(verifyJWT, getCurrentTeacher);

// Route to update authenticated teacher's non-sensitive details (Requires authentication)
teacherRoutes.route("/update-details").patch(verifyJWT, updateTeacherDetails);

// Route to update authenticated teacher's avatar (Requires authentication and file upload)
teacherRoutes.route("/update-avatar").patch(
  verifyJWT, // Ensure user is authenticated first
  upload.single("avatar"), // Handle avatar file upload
  updateTeacherAvatar // Process the update
);

// Route to get a specific teacher by ID
teacherRoutes.route("/:teacherId").get(getTeacherById);
export { teacherRoutes };
