import { Router } from "express";
import {
  getStudentsByCourseAndSemester,
  ModifyAttendance,
  removeStudentAttendance,
  addAttendance,
  attendanceCount
} from "../controllers/attendance.controller.js";

const attendanceRoutes = Router();

attendanceRoutes.route("/count").get(attendanceCount); // get attendance count

attendanceRoutes.route("/").post(addAttendance); //add a new attendance record

attendanceRoutes
  .route("/:id")
  .delete(removeStudentAttendance) // get a specific attendance record by ID
  .patch(ModifyAttendance); //edit a specific attendance record by ID

export { attendanceRoutes }; // Export the router

attendanceRoutes.route("/filter").post(getStudentsByCourseAndSemester);
