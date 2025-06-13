import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  courseCount,
  courseList,
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const courseRoutes = Router();
courseRoutes.get("/list", courseList);
courseRoutes.route("/count").get(courseCount);
courseRoutes.route("/").post(addCourse).get(verifyJWT, getAllCourses);
courseRoutes
  .route("/:id")
  .get(getCourseById)
  .patch(updateCourse)
  .delete(deleteCourse);

export { courseRoutes };
