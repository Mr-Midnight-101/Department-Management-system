// src/models/course.model.js

import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, "Course code is required."],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Course code must be at least 3 characters long."],
      maxlength: [10, "Course code must not exceed 10 characters."],
      match: [
        /^[A-Z0-9]+$/,
        "Course code must contain only uppercase letters (A-Z) and numbers (0-9), no spaces.",
      ],
    },
    courseTitle: {
      type: String,
      required: [true, "Course title is required."],
      unique: true,
      trim: true,
      minlength: [3, "Course title must be at least 3 characters long."],
      maxlength: [100, "Course title must not exceed 100 characters."],
      match: [
        /^[A-Za-z ]+$/,
        "Name must contain only letters (A-Z, a-z) and spaces.",
      ],
    },
    courseDuration: {
      type: String, // Expected format: "1 year", "2 years", etc.
      required: [true, "Course academic year is required."],
      enum: {
        values: ["1 year", "2 years", "3 years", "4 years"],
        message: "Unknown Value.",
      },
    },
    courseTerms: {
      type: String,
      required: [true, "Course term (semester) is required."],
      enum: {
        values: [
          "1 semester",
          "2 semesters",
          "3 semesters",
          "4 semesters",
          "5 semesters",
          "6 semesters",
          "7 semesters",
          "8 semesters",
        ],
        message: "Unknown Value.",
      },
    },
    courseCreditUnits: {
      type: Number,
      required: [true, "Course credit units are required."],
      min: [0, "Credit units cannot be negative."],
      max: [10, "Credit units must not exceed 10."],
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", CourseSchema);
