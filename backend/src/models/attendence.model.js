// src/models/attendance.model.js

import mongoose from "mongoose";

// Define the schema for attendance records
const attendanceSchema = new mongoose.Schema(
  {
    // Reference to the student who is being marked
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Assumes a 'Student' model exists
      required: true,
      index: true, // Indexing for efficient lookups by student
    },
    // Reference to the subject the attendance is for
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // Assumes a 'Subject' model exists
      required: true,
      index: true, // Indexing for efficient lookups by subject
    },
    // Reference to the teacher who recorded the attendance
    recordBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // Assumes a 'Teacher' model exists
      required: true,
    },
    // Reference to the course the student is enrolled in for this attendance
    course: { // Changed from courseName to course to better reflect it's a ref
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Assumes a 'Course' model exists
      required: true,
    },
    // The academic semester for this attendance record
    semester: {
      type: String,
      required: true,
      // Ensure input matches one of these values (case-sensitive as per original enum)
      enum: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"],
    },
    // The specific date of the attendance
    date: {
      type: Date,
      required: true,
      index: true, // Indexing for efficient lookups by date
    },
    // The attendance status (e.g., Present, Absent)
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      required: true,
      default: "Absent",
    },
    // Optional: field for specific lecture/session number if needed
    // lectureNumber: { type: Number },
  },
  {
    // Mongoose timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the Attendance model
export const Attendance = mongoose.model("Attendance", attendanceSchema);