import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  courseCount,
} from "../controllers/course.controller.js";

const courseRoutes = Router();

courseRoutes.route("/count").get(courseCount);
courseRoutes.route("/").post(addCourse).get(getAllCourses);
courseRoutes
  .route("/:id")
  .get(getCourseById)
  .patch(updateCourse)
  .delete(deleteCourse);

export { courseRoutes };
