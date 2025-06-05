import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentFullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    studentDateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    studentEnrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    studentRollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    studentEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    studentContactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      unique: true,
      trim: true,
    },
    studentFatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    studentAddress: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        default: "Jabalpur",
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        default: "Madhya Pradesh",
      },
      postalCode: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
      country: {
        type: String,
        trim: true,
        uppercase: true,
        default: "INDIA",
      },
    },
    studentCategory: {
      type: String,
      required: [true, "Category is required"],
      enum: ["GEN", "OBC", "SC", "ST", "OTHER"],
      trim: true,
      uppercase: true,
    },
    studentCurrentCourseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    studentType: {
      type: String,
      required: [true, "Student type is required"],
      enum: ["Regular", "Private", "International"],
    },
    studentAdmissionYear: {
      type: Number,
      required: [true, "Admission year is required"],
      min: [1900, "Admission year cannot be before 1900"],
      max: new Date().getFullYear() + 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
