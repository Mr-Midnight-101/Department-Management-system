// src/routes/course.routes.js

import { Router } from "express";
import {
  addCourse,
  getAllCourses, // Import the new function
  getCourseById,
  updateCourse,
} from "../controllers/course.controller.js"; // Corrected import to named exports
import { Course } from "../models/course.model.js";
import Apiresponse from "../utils/Apiresponse.js";


const courseRoutes = Router(); // Renamed for clarity if needed, but kept original name

courseRoutes.route("/count").get(async (req, res) => {
  try {
    const count = await Course.countDocuments();
    return res.status(200).json(new Apiresponse(200, count, "count"));
  } catch (error) {
    console.log(error);
  }
});
// Define routes for courses.
// Using the base path /api/courses (assuming this is how the router is used)

// Route to add a new course (POST request)
// POST /api/courses
courseRoutes.route("/add-course").post(addCourse);

// Route to get all courses (GET request)
// GET /api/courses
courseRoutes.route("/get-course").get(getAllCourses);

// Route to get a specific course by ID (GET request with parameter)
// GET /api/courses/:id
courseRoutes.route("/:id").get(getCourseById);

// Route to update a specific course by ID (PUT request with parameter)
// PUT /api/courses/:id
courseRoutes.route("/:id").put(updateCourse);

// Export the router
export { courseRoutes };
