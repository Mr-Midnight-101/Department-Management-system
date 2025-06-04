import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      unique: true,
      trim: true,
    },
    subjectMaxMarksTheory: {
      type: Number,
      required: [true, "Maximum theory marks are required"],
      min: [0, "Marks cannot be negative"],
    },
    subjectMaxMarksPractical: {
      type: Number,
      required: [true, "Maximum practical marks are required"],
      min: [0, "Marks cannot be negative"],
    },
    subjectCreditPoints: {
      type: Number,
      required: [true, "Credit points are required"],
      min: [0, "Credit points cannot be negative"],
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
