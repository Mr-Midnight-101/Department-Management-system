import { Router } from "express";
import {
  addAttendance,
  showAllAttendance,
  getAttendanceById,
  editAttendance,
  attendanceCount,
} from "../controllers/attendance.controller.js";

const attendanceRoutes = Router();

attendanceRoutes.route("/count").get(attendanceCount); // get attendance count

attendanceRoutes
  .route("/")
  .post(addAttendance) //add a new attendance record
  .get(showAllAttendance); //get all attendance records

attendanceRoutes
  .route("/:id")
  .get(getAttendanceById) // get a specific attendance record by ID
  .patch(editAttendance); //edit a specific attendance record by ID

export { attendanceRoutes }; // Export the router
