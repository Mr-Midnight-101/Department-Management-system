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
        "First",
        "Second",
        "Third",
        "Fourth",
        "Fifth",
        "Sixth",
        "Seventh",
        "Eighth",
      ],
    },
    attendanceStatus: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      required: true,
      default: "Absent",
    },
    attendanceDate:{
      type:Date,
      required:true,
    }
  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
