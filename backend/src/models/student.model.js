// src/models/student.model.js

import mongoose from "mongoose";
// Removed imports related to authentication as students do not login
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// Define the schema for the Student model
const studentSchema = new mongoose.Schema(
  {
    // Full name of the student
    fullName: {
      type: String,
      required: [true, "Full name is required!!"],
      index: true, // Indexing for efficient searching by name
      trim: true,
      lowercase: true, // Store in lowercase for consistency
    },
    // Removed username field as students do not have login accounts
    // username: { ... }

    // Removed password field as students do not have login accounts
    // password: { ... }

    // Student's date of birth
    dateOfBirth: {
      type: Date,
      required: true,
    },
    // Unique enrollment number
    enrollmentNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Store in uppercase for consistency
    },
    // Unique roll number
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Store in uppercase for consistency
    },
    // Student's email address, must be unique
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Student's contact information (e.g., phone number), must be unique
    contactInfo: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    // Student's father's name
    fatherName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Student's full address (embedded document)
    fullAdd: {
      type: {
        street: {
          type: String,
          // required: true, // Street is optional in schema
          trim: true,
          lowercase: true,
        },
        city: {
          type: String,
          required: true, // City is required
          trim: true,
          default: "Jabalpur",
          lowercase: true,
        },
        state: {
          type: String,
          required: true, // State is required
          default: "Madhya Pradesh",
          trim: true,
          lowercase: true,
        },
        postalCode: {
          type: String,
          // required: true, // Postal code is optional in schema
          trim: true,
          lowercase: true,
        },
        country: {
          type: String,
          required: true, // Country is required
          default: "India",
          trim: true,
          lowercase: true,
        },
      },
      required: true, // The fullAdd object itself is required
    },
    // Student's category (e.g., GEN, OBC)
    category: {
      type: String,
      enum: ["GEN", "OBC", "SC", "ST", "OTHER"], // Allowed categories
      required: true,
      trim: true,
      uppercase: true, // Store in uppercase for consistency
    },
    // Student's current academic semester
    semester: {
      type: String,
      enum: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"], // Allowed semesters
      required: true,
    },
    // Reference to the course the student is currently enrolled in
    currentCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course model
      required: true, // Student must be associated with a course
    },
    // Type of student (e.g., Regular, Private)
    studentType: {
      type: String,
      enum: ["Regular", "Private"], // Allowed student types
      required: true,
    },
    // Year of admission
    admissionYear: {
      type: Number,
      required: true,
      min: 1900, // Basic validation
      max: new Date().getFullYear() + 1, // Prevent future years
    },
    // Removed refreshToken field as students do not have login accounts
    // refreshToken: { ... }
  },
  {
    // Mongoose timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Removed password hashing pre-save hook

// Removed authentication methods (isPasswordCorrect, generateAccessToken, generateRefreshToken)

// Create and export the Student model
export const Student = mongoose.model("Student", studentSchema);