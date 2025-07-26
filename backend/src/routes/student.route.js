import { Router } from "express";

import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  studentCount,
  deleteStudent,
  filterStudents,
} from "../controllers/student.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const studentRoutes = Router();

studentRoutes.route("/count").get( studentCount);
studentRoutes.route("/").post(addStudent).get( getAllStudents);
studentRoutes.route("/filter").post( filterStudents);
studentRoutes
  .route("/:id")
  .get(getStudentById)
  .patch(updateStudent)
  .delete(deleteStudent);

export { studentRoutes };
