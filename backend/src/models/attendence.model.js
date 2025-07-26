import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    attendanceStudent: {
      type: String,
      required: true,
    },
    attendanceRecordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    attendanceCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    attendanceSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    attendanceSemester: {
      type: String,
      required: true,
    },

    attendanceDate: {
      type: Date,
    },
    attendanceStatus: {
      type: String,
      default: "Absent",
      enum: ["Present", "Absent", "Late", "Excused"],
    },
  },
  {
    timestamps: true,
  }
);
//AttendanceSchema.index({ studentId: 1, date: 1, subject: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
