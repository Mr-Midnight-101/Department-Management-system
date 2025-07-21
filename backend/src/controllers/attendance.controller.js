import { Attendance } from "../models/attendence.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getStudentsByCourseAndSemester = asyncHandler(async (req, res) => {
  const { attendanceCourse, attendanceSemester, attendanceSubject } = req.body;

  if (!attendanceCourse) {
    throw new ApiError(400, "Course is required");
  }

  const queryFilter = { attendanceCourse };

  if (attendanceSemester) queryFilter.attendanceSemester = attendanceSemester;
  if (attendanceSubject) queryFilter.attendanceSubject = attendanceSubject;

  const records = await Attendance.find(queryFilter).populate(
    "attendanceStudent.StudentId"
  );

  if (!records || records.length === 0) {
    throw new ApiError(
      404,
      "No attendance records found for the given filters"
    );
  }

  return res
    .status(200)
    .json(
      new Apiresponse(200, records, "Attendance records fetched successfully")
    );
});

const ModifyAttendance = asyncHandler(async (req, res) => {
  const {
    studentId,
    attendanceDate,
    courseId,
    subjectId,
    semester,
    attendanceStatus,
  } = req.body;

  if (!studentId || !attendanceDate || !courseId || !subjectId || !semester) {
    throw new ApiError(400, "Required fields missing");
  }

  const updatedAttendance = await Attendance.findOneAndUpdate(
    {
      attendanceCourse: courseId,
      attendanceSubject: subjectId,
      attendanceSemester: semester,
      attendanceDate: new Date(attendanceDate),
      "attendanceStudent.StudentId": studentId,
    },
    {
      $set: {
        "attendanceStudent.$.attendanceStatus": attendanceStatus,
      },
    },
    { new: true }
  );

  if (!updatedAttendance) {
    throw new ApiError(404, "Student attendance not found");
  }

  return res
    .status(200)
    .json(
      new Apiresponse(200, updatedAttendance, "Attendance updated successfully")
    );
});

const removeStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId, attendanceDate, courseId, subjectId, semester } = req.body;

  if (!studentId || !attendanceDate || !courseId || !subjectId || !semester) {
    throw new ApiError(400, "Required fields missing");
  }

  const updatedDoc = await Attendance.findOneAndUpdate(
    {
      attendanceCourse: courseId,
      attendanceSubject: subjectId,
      attendanceSemester: semester,
      attendanceDate: new Date(attendanceDate),
    },
    {
      $pull: {
        attendanceStudent: { StudentId: studentId },
      },
    },
    { new: true }
  );

  if (!updatedDoc) {
    throw new ApiError(404, "Attendance record not found");
  }

  return res
    .status(200)
    .json(new Apiresponse(200, updatedDoc, "Student removed from attendance"));
});

const addAttendance = asyncHandler(async (req, res) => {
  const {
    attendanceStudent,
    attendanceRecordedBy,
    attendanceCourse,
    attendanceSubject,
    attendanceSemester,
    attendanceDate,
  } = req.body;

  // Validate required fields
  if (
    !attendanceStudent ||
    !Array.isArray(attendanceStudent) ||
    attendanceStudent.length === 0 ||
    !attendanceRecordedBy ||
    !attendanceCourse ||
    !attendanceSubject ||
    !attendanceSemester ||
    !attendanceDate
  ) {
    throw new ApiError(
      400,
      "All attendance fields are required and must be valid."
    );
  }

  // Create attendance record
  const newAttendance = await Attendance.create({
    attendanceStudent, // Must be an array of { StudentId, attendanceStatus }
    attendanceRecordedBy,
    attendanceCourse,
    attendanceSubject,
    attendanceSemester,
    attendanceDate,
  });

  // Verify creation
  const savedAttendance = await Attendance.findById(newAttendance._id)
    .populate("attendanceStudent.StudentId", "name rollNumber") // optional
    .populate("attendanceCourse", "courseName")
    .populate("attendanceSubject", "subjectName")
    .populate("attendanceRecordedBy", "name");

  if (!savedAttendance) {
    throw new ApiError(500, "Failed to fetch saved attendance record.");
  }

  return res
    .status(201)
    .json(
      new Apiresponse(201, savedAttendance, "Attendance recorded successfully")
    );
});

export {
  getStudentsByCourseAndSemester,
  ModifyAttendance,
  removeStudentAttendance,
  addAttendance,
};
