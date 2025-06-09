// src/controllers/course.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";

const populateCourse = (query) => {
  // If you have any referenced fields in Course, add them here.
  // Example: return query.populate({ path: "someRefField", select: "name _id" });
  return query;
};

// ⭐ Controller to add a new course
const addCourse = asyncHandler(async (req, res) => {
  const {
    courseCode,
    courseTitle,
    courseDuration,
    courseTerms,
    courseCreditUnits,
  } = req.body;

  if (
    [
      courseCode,
      courseTitle,
      courseDuration,
      courseTerms,
      courseCreditUnits,
    ].some((field) => field === undefined || field === null)
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  if (typeof courseCreditUnits !== "number" || courseCreditUnits < 0) {
    throw new ApiError(
      400,
      "Course credit units must be a non-negative number."
    );
  }

  const existCourse = await Course.findOne({
    $or: [
      { courseCode: courseCode.trim().toUpperCase() },
      { courseTitle: courseTitle.trim() },
    ],
  });

  if (existCourse) {
    let errorMessage = "Course already exists.";
    if (existCourse.courseCode === courseCode.trim().toUpperCase())
      errorMessage = `Course with code '${courseCode
        .trim()
        .toUpperCase()}' already exists.`;
    else if (existCourse.courseTitle === courseTitle.trim())
      errorMessage = `Course with title '${courseTitle.trim()}' already exists.`;
    throw new ApiError(409, errorMessage);
  }

  const course = await Course.create({
    courseCode: courseCode.trim().toUpperCase(),
    courseTitle: courseTitle.trim(),
    courseDuration: courseDuration,
    courseTerms,
    courseCreditUnits,
  });

  if (!course) {
    throw new ApiError(500, "Something went wrong while adding the course.");
  }

  const populatedCourse = await populateCourse(Course.findById(course._id));

  return res
    .status(201)
    .json(
      new Apiresponse(201, await populatedCourse, "Course added successfully.")
    );
});

// ⭐ Controller to get all courses
const getAllCourses = asyncHandler(async (req, res) => {
  const allCourses = await populateCourse(Course.find({}));
  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        allCourses,
        allCourses.length === 0
          ? "No courses found."
          : "Courses fetched successfully."
      )
    );
});

// ⭐ Controller to get a specific course by ID
const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  if (!courseId) {
    throw new ApiError(400, "Course ID not provided.");
  }
  const course = await populateCourse(Course.findById(courseId));
  if (!course) {
    throw new ApiError(404, "Course not found.");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, course, "Course found successfully."));
});

// ⭐ Controller to update a course by ID
const updateCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  if (!courseId) {
    throw new ApiError(400, "Course ID not provided for update.");
  }

  const {
    courseCode,
    courseTitle,
    courseDuration,
    courseTerms,
    courseCreditUnits,
  } = req.body;

  if (
    !(
      courseCode ||
      courseTitle ||
      courseDuration ||
      courseTerms ||
      courseCreditUnits
    )
  ) {
    throw new ApiError(400, "Please provide at least one field to update.");
  }

  if (
    courseCreditUnits !== undefined &&
    (typeof courseCreditUnits !== "number" || courseCreditUnits < 0)
  ) {
    throw new ApiError(
      400,
      "Course credit units must be a non-negative number if provided."
    );
  }

  const updatedCourse = await populateCourse(
    Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          ...(courseCode && { courseCode: courseCode.trim().toUpperCase() }),
          ...(courseTitle && { courseTitle: courseTitle.trim() }),
          ...(courseDuration && { courseDuration: courseDuration.trim() }),
          ...(courseTerms && { courseTerms }),
          ...(courseCreditUnits !== undefined && { courseCreditUnits }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
  );

  if (!updatedCourse) {
    throw new ApiError(404, "Course not found for update.");
  }

  return res
    .status(200)
    .json(new Apiresponse(200, updatedCourse, "Course updated successfully."));
});

// ⭐ Controller to delete a course by ID
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params || req.body;
  if (!id) throw new ApiError(404, "Course could not find, Id is not received");
  const course = await populateCourse(Course.findByIdAndDelete(id));
  if (!course)
    throw new ApiError(
      404,
      "Course could not find, Id is received but could not find"
    );
  return res
    .status(200)
    .json(new Apiresponse(200, course, "Course is deleted successfully"));
});

// ⭐ Controller to get the count of all courses
const courseCount = asyncHandler(async (req, res) => {
  const count = await Course.countDocuments();
  return res
    .status(200)
    .json(new Apiresponse(200, count, "Course count fetched successfully."));
});

// ⭐ course list
const courseList = asyncHandler(async (req, res) => {
  const courses = await Course.find().select("courseCode");

  if (!courses || courses.length === 0) {
    throw ApiError(404, "No courses found");
  }

  return res
    .status(200)
    .json(new Apiresponse(200, courses, "Course list fetched successfully"));
});

// Export all relevant controller functions
export {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  courseCount,
  courseList,
};
