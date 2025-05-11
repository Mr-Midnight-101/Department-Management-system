// src/routes/grade.routes.js

import { Router } from "express";
import {
  addGrade,
  getAllGrades, // Import the new functions
  getGradeById,
  // updateGrade // Import if implementing update
} from "../controllers/grade.controller.js"; // Corrected import to named exports

const gradeRoutes = Router(); // Kept original name

// Define routes for grades
// Using the base path /api/grades (assuming this is how the router is used)

// Route to add a new grade record (POST request)
// POST /api/grades
gradeRoutes.route("/").post(addGrade);

// Route to get all grade records (GET request)
// GET /api/grades
gradeRoutes.route("/").get(getAllGrades);

// Route to get a specific grade record by ID (GET request with parameter)
// GET /api/grades/:id
gradeRoutes.route("/:id").get(getGradeById);

// Route to update a specific grade record by ID (PUT or PATCH request with parameter)
// Uncomment and implement if updateGrade controller function is implemented
// PUT /api/grades/:id
// gradeRoutes.route("/:id").put(updateGrade);
// PATCH /api/grades/:id // PATCH is often preferred for partial updates
// gradeRoutes.route("/:id").patch(updateGrade);


// Export the router
export {gradeRoutes};