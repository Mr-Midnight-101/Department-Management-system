import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    gradeStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    gradeSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    gradeExamYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 5,
    },
    gradeCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    gradeObtainedPractical: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeObtainedTheory: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeTotalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeLetter: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    gradePoint: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeCreditPoint: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeTotalCreditPoints: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeTotalCreditValid: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeSecuredValidCredit: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeCVV: {
      type: Number,
      required: true,
      min: 0,
    },
    gradeExamMonth: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Grade = mongoose.model("Grade", gradeSchema);
