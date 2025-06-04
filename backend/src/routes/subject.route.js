import { Router } from "express";
import {
  addSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  subjectCount,
} from "../controllers/subject.controller.js";

const subjectRoutes = Router();

subjectRoutes.route("/count").get(subjectCount);
subjectRoutes.route("/").post(addSubject).get(getAllSubjects);
subjectRoutes.route("/:id").patch(updateSubject).delete(deleteSubject);

export { subjectRoutes };
