import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    attendanceStudent: [
      {
        StudentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        attendanceStatus: {
          type: String,
          enum: ["Present", "Absent", "Late", "Excused"],
          default: "Absent",
        },
      },
    ],
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
    attendanceSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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

    attendanceDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
