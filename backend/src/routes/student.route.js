// src/routes/student.routes.js
import { Student } from "../models/student.model.js";
import { Router } from "express";
import Apiresponse from "../utils/Apiresponse.js";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  studentCount,
} from "../controllers/student.controller.js";

const studentRoutes = Router();
studentRoutes.route("/count").get(async (req, res ) => {
  try {
    const count = await Student.countDocuments();
    return res.status(200).json(new Apiresponse(200, count, "count"));
  } catch (error) {
    console.log(error);
  }
});

// Define routes for students.
// Using the base path /api/students (assuming this is how the router is used)

// Route to add a new student record (POST request)
// POST /api/students
studentRoutes.route("/").post(addStudent);

// Route to get all student records (GET request)
// GET /api/students
studentRoutes.route("/").get(getAllStudents);

// Route to get a specific student record by ID (GET request with parameter)
// GET /api/students/:id
studentRoutes.route("/:id").get(getStudentById);

// Route to update a specific student record by ID (PATCH request with parameter)
// Using PATCH as we're likely doing a partial update via $set
// PATCH /api/students/:id
studentRoutes.route("/:id").patch(updateStudent);

// No student authentication routes needed as students do not login.

// Export the router
export { studentRoutes };
