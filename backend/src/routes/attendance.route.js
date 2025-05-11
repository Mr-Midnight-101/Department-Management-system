// src/routes/attendanceRoutes.js

import { Router } from "express";
import {
  addAttendance,
  showAllAttendance,
  getAttendanceById, // Import the new controller function
} from "../controllers/attendance.controller.js"; // Corrected import

const attendanceRoutes = Router();

// Define routes for attendance
// Use specific paths for clarity and REST conventions

// Route to add a new attendance record (POST request)
attendanceRoutes.route("/add").post(addAttendance);

// Route to get all attendance records (GET request)
attendanceRoutes.route("/all").get(showAllAttendance);

// Route to get a specific attendance record by ID (GET request with parameter)
attendanceRoutes.route("/:id").get(getAttendanceById); // Use /:id for fetching by ID

export { attendanceRoutes }; // Export the router
