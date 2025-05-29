// src/models/student.model.js

import mongoose from "mongoose";

// Define the schema for the Student model
const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      index: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    enrollmentNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactInfo: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    fullAdd: {
      type: {
        street: {
          type: String,
          trim: true,
          default: "",
        },
        city: {
          type: String,
          required: true,
          trim: true,
          default: "Jabalpur",
        },
        state: {
          type: String,
          required: true,
          default: "Madhya Pradesh",
          trim: true,
        },
        postalCode: {
          type: String,
          trim: true,
          lowercase: true,
          default: "",
        },
        country: {
          type: String,
          default: "India",
          trim: true,
          uppercase: true,
        },
      },
      required: true,
    },
    category: {
      type: String,
      enum: ["GEN", "OBC", "SC", "ST", "OTHER"],
      required: true,
      trim: true,
      uppercase: true,
    },
    currentCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    studentType: {
      type: String,
      enum: ["Regular", "Private", "International"],
      required: true,
    },
    admissionYear: {
      type: Number,
      required: true,
      min: 1900,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
