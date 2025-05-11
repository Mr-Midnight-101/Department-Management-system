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
  getData,
  getAllData,
  totalDocument
} from "../controllers/teacher.controller.js"; // Corrected import path and names
import { verifyJWT } from "../middleware/auth.middleware.js"; // Assuming this middleware exists
import { upload } from "../middleware/multer.middleware.js"; // Assuming this middleware exists

const teacherRoutes = Router(); // Renamed from authRoute for clarity

// --- Authentication Routes ---

// Route for teacher registration with avatar upload middleware
teacherRoutes
  .route("/auth/register")
  .post(upload.single("avatar"), registerTeacher);

// Route for teacher login
teacherRoutes.route("/auth/login").post(verifyJWT, loginTeacher);

// Route to refresh access token using refresh token (Doesn't require verifyJWT as it validates the refresh token itself)
teacherRoutes.route("/auth/refresh-token").post(refreshAccessToken); // POST is common for sending token in body, PUT is also possible

// --- Secured Routes (Require JWT Verification) ---

// Apply verifyJWT middleware to all subsequent routes in this file
// teacherRoutes.use(verifyJWT); // Alternative: apply middleware globally to all routes below this line

// Route for teacher logout (Requires authentication)
teacherRoutes.route("/auth/logout").post(verifyJWT, logoutTeacher); // Applied middleware per route

// Route to change authenticated teacher's password (Requires authentication)
teacherRoutes
  .route("/profile/change-password")
  .patch(verifyJWT, changePassword);

// Route to get authenticated teacher's current details (Requires authentication)
teacherRoutes.route("/profile/current-user").get(verifyJWT, getCurrentTeacher); // Changed method to GET

// Route to update authenticated teacher's non-sensitive details (Requires authentication)
teacherRoutes
  .route("/profile/update-details")
  .put(verifyJWT, updateTeacherDetails); // Changed method to PUT

// Route to update authenticated teacher's avatar (Requires authentication and file upload)
teacherRoutes.route("/profile/update-avatar").put(
  verifyJWT, // Ensure user is authenticated first
  upload.single("avatar"), // Handle avatar file upload
  updateTeacherAvatar // Process the update
);

teacherRoutes.route("/getdata/:id").get(getData);
teacherRoutes.route("/getAlldata").get(getAllData);
teacherRoutes.route("/total-document").get(totalDocument);

export { teacherRoutes }; // Export the router
