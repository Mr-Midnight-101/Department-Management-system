// src/controllers/course.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { mongo } from "mongoose";
import mongoose from "mongoose";
// Subject model might be needed for validation or population, already referenced
// import { Subject } from "../models/subject.model.js";

// ⭐ Controller to add a new course
const addCourse = asyncHandler(async (req, res) => {
  // Corrected argument order
  // Extract necessary fields from the request body
  const {
    courseCode,
    courseName,
    academicYear,
    semester,
    subjects, // Assuming subjects array can be part of creation payload or empty
    courseCredit,
  } = req.body;

  // Validate required fields - using a more robust check
  // Assuming subjects are not required at creation, they can be added later
  if (
    [courseCode, courseName, academicYear, semester, courseCredit].some(
      (field) => field === undefined || field === null
    )
  ) {
    const missingField = [
      courseCode,
      courseName,
      academicYear,
      semester,
      courseCredit,
    ].find((field) => field === undefined || field === null);
    throw new ApiError(
      400,
      `${missingField || "One or more required fields"} cannot be empty.`
    );
  }

  // Validate courseCredit is a positive number
  if (typeof courseCredit !== "number" || courseCredit < 0) {
    throw new ApiError(400, "Course credit must be a non-negative number.");
  }

  // Validate subjects if provided - ensure it's an array of ObjectIds (basic check)
  if (subjects !== undefined && !Array.isArray(subjects)) {
    throw new ApiError(400, "Subjects must be provided as an array.");
  }
  // Further validation: check if subject IDs are valid ObjectIds if needed

  // Check if the course already exists by code or name
  const existCourse = await Course.findOne({
    $or: [
      { courseCode: courseCode.trim().toUpperCase() }, // Check uppercase code
      { courseName: courseName.trim() }, // Check trimmed name
    ],
  });

  if (existCourse) {
    // Provide more specific error message
    let errorMessage = "Course already exists.";
    if (existCourse.courseCode === courseCode.trim().toUpperCase())
      errorMessage = `Course with code '${courseCode
        .trim()
        .toUpperCase()}' already exists.`;
    else if (existCourse.courseName === courseName.trim())
      errorMessage = `Course with name '${courseName.trim()}' already exists.`;
    throw new ApiError(409, errorMessage); // Use 409 Conflict for existing resource
  }

  // Create the new course document
  const course = await Course.create({
    courseCode: courseCode.trim().toUpperCase(), // Trim and uppercase code
    courseName: courseName.trim(), // Trim name
    academicYear: academicYear, // Trim year
    semester: semester, // Trim semester (ensure casing matches schema enum if applicable)
    subjects: subjects || [], // Use provided subjects array or an empty array if none provided
    courseCredit,
  });

  // Fetch the created course with populated subject details
  const createdCourse = await Course.aggregate([
    { $match: { _id: course._id } },
    {
      $lookup: {
        from: "subjects",
        localField: "subjects",
        foreignField: "_id",
        as: "subjectName",
      },
    },
    {
      $unwind: {
        path: "$subjects",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  // Check if course creation was successful
  if (!createdCourse) {
    // If findById fails after create, something went wrong during save
    throw new ApiError(500, "Something went wrong while adding the course.");
  }

  // Return a success response with the created course data
  return res
    .status(201) // Use 201 Created for successful resource creation
    .json(new Apiresponse(201, createdCourse, "Course added successfully.")); // Corrected message
});

// ⭐ Controller to get all courses
const getAllCourses = asyncHandler(async (req, res) => {
  // Implement fetching all courses
  // Can add filtering, sorting, and pagination here based on requirements

  const allCourses = await Course.aggregate([
    {
      $lookup: {
        from: "subjects",
        localField: "subjects",
        foreignField: "_id",
        as: "subjects",
      },
    },
    {
      $unwind: {
        path: "$subjectName",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]); // Fetch all and populate

  if (!allCourses || allCourses.length === 0) {
    // Return 200 with empty array if no courses are found
    return res.status(200).json(new Apiresponse(200, [], "No courses found."));
  }

  // Return success response with all courses
  return res
    .status(200)
    .json(new Apiresponse(200, allCourses, "Courses fetched successfully."));
});

// ⭐ Controller to get a specific course by ID
const getCourseById = asyncHandler(async (req, res) => {
  // Get the course ID from the URL parameters
  const courseId = req.params.id;

  // Validate that an ID was provided
  if (!courseId) {
    throw new ApiError(400, "Course ID not provided."); // Use 400 for bad request (missing ID)
  }
  const courseid = new mongoose.Types.ObjectId(courseId);
  // Find the course by ID and populate subject details
  const course = await Course.aggregate([
    { $match: { _id: courseid } },
    {
      $lookup: {
        from: "subjects",
        localField: "subjects",
        foreignField: "_id",
        as: "subjects",
      },
    },
    {
      $unwind: {
        path: "$subjects",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  // Check if the course was found
  if (!course) {
    throw new ApiError(404, "Course not found."); // Use 404 for not found
  }

  // Return success response with the course data
  return res
    .status(200)
    .json(new Apiresponse(200, course, "Course found successfully.")); // Corrected message
});

// ⭐ Controller to update a course by ID
const updateCourse = asyncHandler(async (req, res) => {
  // Get the course ID from the URL parameters
  const courseId = req.params.id;

  // Validate that an ID was provided
  if (!courseId) {
    throw new ApiError(400, "Course ID not provided for update."); // Use 400
  }

  // Get updatable fields from request body
  const {
    courseCode,
    courseName,
    academicYear,
    semester,
    subjects, // Assuming subjects array can be updated
    courseCredit,
  } = req.body;

  // Basic validation: Check if at least one field is provided for update
  if (
    !(
      courseCode ||
      courseName ||
      academicYear ||
      semester ||
      subjects ||
      courseCredit
    )
  ) {
    throw new ApiError(400, "Please provide at least one field to update.");
  }

  // Validate courseCredit if provided
  if (
    courseCredit !== undefined &&
    (typeof courseCredit !== "number" || courseCredit < 0)
  ) {
    throw new ApiError(
      400,
      "Course credit must be a non-negative number if provided."
    );
  }

  // Validate subjects if provided
  if (subjects !== undefined && !Array.isArray(subjects)) {
    throw new ApiError(
      400,
      "Subjects must be provided as an array if updating."
    );
  }
  // Further validation: check if subject IDs are valid ObjectIds if needed

  // Find the course by ID and update it
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId, // Find by ID from params
    {
      $set: {
        // Use $set to update specific fields
        // Only include fields that were actually provided in the body
        ...(courseCode && { courseCode: courseCode.trim().toUpperCase() }), // Update code
        ...(courseName && { courseName: courseName.trim() }), // Update name
        ...(academicYear && { academicYear: academicYear }), // Update year
        ...(semester && { semester: semester }), // Update semester
        ...(subjects !== undefined && { subjects: subjects || [] }), // Update subjects array, default to empty if null/undefined provided
        ...(courseCredit !== undefined && { courseCredit }), // Update credit
      },
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update operation (important for unique, min, max)
    }
  ).populate("subjects", "subjectName"); // Populate subject details in the returned document

  // Check if the course was found and updated
  if (!updatedCourse) {
    throw new ApiError(404, "Course not found for update."); // Use 404
  }

  // Return success response with the updated course data
  return res
    .status(200) // Use 200 OK for successful update
    .json(new Apiresponse(200, updatedCourse, "Course updated successfully.")); // Corrected message
});

// Export all relevant controller functions
export { addCourse, getAllCourses, getCourseById, updateCourse }; // Added getAllCourses
