// src/models/course.model.js

import mongoose from "mongoose";
// Removed unused import
// import { Student } from "./student.model";

// Define the schema for the Course model
const courseSchema = new mongoose.Schema({
  // Unique code for the course
  courseCode: {
    type: String,
    required: true,
    unique: true, // Added unique constraint
    trim: true,
    uppercase: true, // Store in uppercase for consistency
  },
  // Full name of the course
  courseName: {
    type: String,
    required: true,
    unique: true, // Added unique constraint
    trim: true,
    // lowercase: true, // Let's keep original casing or decide on one standard
  },
  // Academic year the course belongs to (e.g., "2023-2024")
  academicYear: {
    type: String,
    required: true,
    trim: true,
  },
  // Semester the course is offered in
  semester: {
    type: String,
    required: true, // Made required based on controller validation logic
    trim: true,
    // Ensure consistency with controller/enum if used elsewhere
  },
  // Array of subjects included in this course
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // Reference to the Subject model
      required: true, // Indicates each item in the array must be a valid ObjectId
    },
  ],
  // Total credit points for the course
  courseCredit: {
    type: Number,
    required: true,
    min: 0, // Added minimum value validation
  },
  // Timestamps for creation and updates
}, { timestamps: true }); // Use timestamps option

// Create and export the Course model
export const Course = mongoose.model("Course", courseSchema);