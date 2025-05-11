// src/models/grade.model.js

import mongoose from "mongoose";
// No need to import Schema explicitly unless using it directly like `new Schema(...)`
// import { Schema } from "mongoose";

// Define the schema for the Grade model
const gradeSchema = new mongoose.Schema(
  {
    // Reference to the student who received the grade
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Assumes a 'Student' model exists
      required: true,
      index: true, // Indexing for efficient lookups by student
    },
    // Reference to the subject the grade is for
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // Assumes a 'Subject' model exists
      required: true,
      index: true, // Indexing for efficient lookups by subject
    },
    // The academic year of the exam (e.g., 2023)
    examYear: {
      type: Number, // Changed from Date to Number for just the year
      required: true,
      min: 1900, // Basic validation
      max: new Date().getFullYear() + 5, // Prevent future years far out
    },
    // Reference to the course the student is enrolled in for this grade
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Assumes a 'Course' model exists
      required: true,
    },
    // Marks obtained in the practical part of the subject
    obtMarksPractical: {
      type: Number,
      required: true,
      min: 0, // Marks cannot be negative
    },
    // Marks obtained in the theory part of the subject
    obtMarksTheory: { // Corrected typo from ObtMarksTheory
      type: Number,
      required: true,
      min: 0, // Marks cannot be negative
    },
    // Total marks obtained (usually obtMarksPractical + obtMarksTheory)
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    // The letter grade (e.g., A, B+, C)
    gradeLetter: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // Store in uppercase for consistency
    },
    // The numerical grade point (e.g., 4.0, 3.7)
    gradePoint: {
      type: Number,
      required: true,
      min: 0, // Grade point cannot be negative
    },
    // The credit value of the subject (should ideally come from Subject model)
    // Assuming for now it's stored here based on controller logic
    creditPoint: {
      type: Number,
      required: true,
      min: 0, // Credit point cannot be negative
    },
     // Total credit points for this subject (gradePoint * creditPoint)
    totalCreditPoint: {
      type: Number,
      required: true,
      min: 0,
    },
    // Fields related to credit validation - purpose unclear from names alone
    // Adding comments based on potential interpretations or requiring clarification
    totalCreditValid: { // e.g., Total valid credits for this exam period/subject
      type: Number,
      required: true,
      min: 0,
    },
    securedValidCredit: { // e.g., Credits secured that are considered valid
      type: Number,
      required: true,
      min: 0,
    },
    CVV: { // This name is confusing, purpose needs clarification (e.g., Credit Validity Value?)
           // Assuming it's a derived numerical value
      type: Number,
      required: true,
      min: 0,
    },
    // The month of the exam (e.g., "April", "December")
    examMonth: {
      type: String,
      required: true,
      trim: true,
      // lowercase: true // Keep original case or decide standard (e.g., "April")
    },
    // Timestamps for creation and updates
  },
  {
    // Mongoose timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Add a compound unique index to prevent duplicate grades for the same student, subject, and exam period
gradeSchema.index({ student: 1, subject: 1, examYear: 1, examMonth: 1 }, { unique: true });


// Create and export the Grade model
export const Grade = mongoose.model("Grade", gradeSchema);