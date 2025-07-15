import { Router } from "express";
import { Teacher } from "../models/teacher.model.js";
import { Subject } from "../models/subject.model.js";
import { Student } from "../models/student.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/Apiresponse.js";
import ApiError from "../utils/ApiError.js";

export const countDocuments = Router();

countDocuments.get(
  "/v1/count-doc",
  asyncHandler(async (req, res) => {
    const teacherCount = await Teacher.countDocuments();
    const subjectCount = await Subject.countDocuments();
    const studentCount = await Student.countDocuments();
    const courseCount = await Course.countDocuments();

    // Optional: Only throw if all counts are 0 (not individually falsey)
    const allZero = [
      teacherCount,
      subjectCount,
      studentCount,
      courseCount,
    ].every((count) => count === 0);
    if (allZero) {
      throw new ApiError(404, "No documents found in any collection.");
    }

    const count = {
      teachers: teacherCount,
      subjects: subjectCount,
      students: studentCount,
      courses: courseCount,
    };

    res
      .status(200)
      .json(new ApiResponse(200, count, "Counts fetched successfully"));
  })
);
