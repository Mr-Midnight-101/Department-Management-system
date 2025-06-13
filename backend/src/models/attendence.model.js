import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    attendanceStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    attendanceRecordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    attendanceCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    attendanceSemester: {
      type: String,
      required: true,
      enum: [
        "First semester",
        "Second semester",
        "Third semester",
        "Fourth semester",
        "Fifth semester",
        "Sixth semester",
        "Seventh semester",
        "Eighth semester",
      ],
    },
    attendanceDate: {
      type: Date,
      required: true,
    },
    attendanceStatus: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      required: true,
      default: "Absent",
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
