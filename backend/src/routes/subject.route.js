// src/routes/subject.routes.js // Corrected file name reference
import Apiresponse from "../utils/Apiresponse.js";
import { Subject } from "../models/subject.model.js";
import { Router } from "express";
import {
  addSubject, // Renamed import
  getAllSubjects, // Renamed import
  getSubjectById, // Renamed import
  updateSubject, // Renamed import
} from "../controllers/subject.controller.js"; // Corrected import path and names

const subjectRoutes = Router(); // Kept original name

subjectRoutes.route("/count").get(async (req, res) => {
  const count = await Subject.countDocuments();
  res
    .status(200)
    .json(new Apiresponse(200, count, "Subject count successfully"));
});
// Define routes for subjects.
// Using the base path /api/subjects (assuming this is how the router is used)

// Route to add a new subject (POST request)
// POST /api/subjects
subjectRoutes.route("/").post(addSubject);

// Route to get all subjects (GET request)
// GET /api/subjects
subjectRoutes.route("/").get(getAllSubjects);

// Route to get a specific subject by ID (GET request with parameter)
// GET /api/subjects/:id
subjectRoutes.route("/:id").get(getSubjectById);

// Route to update a specific subject by ID (PATCH request with parameter)
// Using PATCH as we're likely doing a partial update via $set
// PATCH /api/subjects/:id
subjectRoutes.route("/:id").patch(updateSubject); // Changed method from PUT to PATCH and path

// Export the router
export { subjectRoutes };
