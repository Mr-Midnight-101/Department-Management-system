// src/routes/student.routes.js
import { Router } from "express";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  studentCount,
} from "../controllers/student.controller.js";

const studentRoutes = Router();

// GET /student/count
studentRoutes.route("/count").get(studentCount);
// POST /student
studentRoutes.route("/").post(addStudent);
// GET /student
studentRoutes.route("/").get(getAllStudents);
// GET /student/:id
studentRoutes.route("/:id").get(getStudentById);
// PATCH /student/:id
studentRoutes.route("/:id").patch(updateStudent);

export { studentRoutes };
