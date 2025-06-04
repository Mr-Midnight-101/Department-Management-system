import { Router } from "express";
import {
  addGrade,
  getAllGrades,
  getGradeById,
  gradeCount,
  updateGrade,
} from "../controllers/grade.controller.js";

const gradeRoutes = Router();

gradeRoutes.route("/count").get(gradeCount);
gradeRoutes.route("/").post(addGrade).get(getAllGrades);
gradeRoutes.route("/:id").get(getGradeById).patch(updateGrade);

// Export the router
export { gradeRoutes };
