// src/models/subject.model.js

import mongoose from "mongoose";

// Define the schema for the Subject model
const subjectSchema = new mongoose.Schema(
  {
    // Unique code for the subject
    subjectCode: {
      type: String,
      required: true,
      unique: true, // Added unique constraint
      index: true, // Indexing for efficient lookups
      trim: true,
      uppercase: true, // Store in uppercase for consistency
    },
    // Name of the subject
    subjectName: {
      type: String,
      required: true,
      unique: true, // Added unique constraint
      trim: true,
      // lowercase: true, // Keep original casing or decide on one standard
    },
    // Maximum marks for the theory part
    maxMarksTheory: { // Corrected typo from MaxMarksTheory
      type: Number,
      required: true,
      min: 0, // Marks cannot be negative
    },
    // Maximum marks for the practical part
    maxMarksPractical: { // Corrected typo from MaxMarksPractical
      type: Number,
      required: true,
      min: 0, // Marks cannot be negative
    },
    // Credit value of the subject
    subCredit: {
      type: Number,
      required: true,
      min: 0, // Credit cannot be negative
    },
    // Array of teachers assigned to this subject
    subjectTeacher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher", // Reference to the Teacher model
      },
    ],
    // Timestamps for creation and updates
  },
  { timestamps: true } // Use timestamps option
);

// Create and export the Subject model
export const Subject = mongoose.model("Subject", subjectSchema);