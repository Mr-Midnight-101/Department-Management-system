import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Subject code must be at least 3 characters long."],
      maxlength: [10, "Subject code must not exceed 10 characters."],
      match: [
        /^[A-Z0-9]+$/,
        "Subject code must contain only uppercase letters (A-Z) and numbers (0-9), no spaces.",
      ],
    },
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Subject title must be at least 3 characters long."],
      maxlength: [50, "Subject title must not exceed 50 characters."],
      match: [
        /^[A-Za-z ]+$/,
        "Name must contain only letters (A-Z, a-z) and spaces.",
      ],
    },
    subjectMaxMarksTheory: {
      type: Number,
      required: [true, "Maximum theory marks are required"],
      min: [0, "Marks cannot be negative"],
      max: [100, "Marks cannot exceed 100"],
    },
    subjectMaxMarksPractical: {
      type: Number,
      required: [true, "Maximum practical marks are required"],
      min: [0, "Marks cannot be negative"],
      max: [100, "Marks cannot exceed 100"],
    },
    subjectCreditPoints: {
      type: Number,
      required: [true, "Credit points are required"],
      min: [0, "Credit points cannot be negative"],
      max: [10, "Credit cannot exceed 10"],
    },
    subjectTeachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
