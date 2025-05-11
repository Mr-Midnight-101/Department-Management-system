// src/controllers/attendanceController.js

import { Attendance } from "../models/attendence.model.js"; // Corrected import name
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
// Course model might not be strictly needed here unless creating/validating Course
// import { Course } from "../models/course.model.js";

// ⭐ Helper function to populate attendance details
const populateAttendance = (query) => {
  return query
    .populate("student", "fullName") // Populate student's fullName
    .populate("subject", "subjectName") // Populate subject's subjectName
    .populate("recordBy", "fullName") // Populate teacher's fullName (assuming 'recordBy' refers to a Teacher)
    .populate("course", "courseName"); // Populate course's courseName (assuming 'course' is the ref field)
};

// ⭐ Controller to add a new attendance record
const addAttendance = asyncHandler(async (req, res) => {
  // Extract necessary fields from the request body
  const { student, subject, recordBy, course, semester, date, status } =
    req.body;

  // Validate required fields
  // Using a more robust check for empty/missing fields
  if (
    [student, subject, recordBy, course, semester, date, status].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All required fields (student, subject, recordBy, course, semester, date, status) must be provided and cannot be empty.");
  }

  // Convert date string to Date object if it's a string
  const attendanceDate = new Date(date);
  if (isNaN(attendanceDate.getTime())) {
      throw new ApiError(400, "Invalid date format provided.");
  }


  // Check if attendance for this student, subject, and date already exists
  const existedAttendance = await Attendance.findOne({
    student: student,
    subject: subject,
    date: attendanceDate, // Check for attendance on the specific date
  });

  if (existedAttendance) {
    // Provide more specific error message
    throw new ApiError(409, `Attendance for student ${student} in subject ${subject} on ${attendanceDate.toDateString()} has already been marked.`);
  }

  // Create the new attendance record
  const attendance = await Attendance.create({
    student: student, // Assuming student, subject, recordBy, course are valid ObjectIds
    subject: subject,
    recordBy: recordBy,
    course: course,
    semester: semester, // Ensure semester matches schema enum casing
    date: attendanceDate,
    status: status, // Ensure status matches schema enum casing
  });

  // Fetch the created attendance record with populated details
  const createdAttendance = await populateAttendance(
    Attendance.findById(attendance._id)
  );

  // Check if the attendance record was successfully created and fetched
  if (!createdAttendance) {
    // If findById fails after create, something is seriously wrong
    throw new ApiError(500, "Something went wrong while saving the attendance record.");
  }

  // Return a success response with the created attendance data
  return res
    .status(201) // Use 201 Created for successful resource creation
    .json(
      new Apiresponse(
        201,
        createdAttendance,
        "Attendance marked successfully." // Corrected message typo
      )
    );
});

// ⭐ Controller to show all attendance records
const showAllAttendance = asyncHandler(async (req, res) => {
  // Implement fetching all attendance records
  // Can add filtering, sorting, and pagination here based on requirements

  const allAttendance = await populateAttendance(Attendance.find({}));

  if (!allAttendance || allAttendance.length === 0) {
    // Return 404 if no attendance records are found, or 200 with empty array
    // Returning 200 with an empty array is generally better for "get all"
    return res
      .status(200)
      .json(new Apiresponse(200, [], "No attendance records found."));
  }

  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        allAttendance,
        "Attendance records fetched successfully."
      )
    );
});

// ⭐ Controller to get attendance for a specific student, subject, or date
// Add more specific GET endpoints if needed (e.g., /:studentId, /:studentId/:subjectId, etc.)
// For now, let's add a general function to get attendance by ID
const getAttendanceById = asyncHandler(async (req, res) => {
    const attendanceId = req.params.id; // Get ID from URL parameters

    if (!attendanceId) {
        throw new ApiError(400, "Attendance ID not provided.");
    }

    const attendance = await populateAttendance(Attendance.findById(attendanceId));

    if (!attendance) {
        throw new ApiError(404, "Attendance record not found.");
    }

    return res
        .status(200)
        .json(new Apiresponse(200, attendance, "Attendance record fetched successfully."));
});


export { addAttendance, showAllAttendance, getAttendanceById }; // Export all relevant functions