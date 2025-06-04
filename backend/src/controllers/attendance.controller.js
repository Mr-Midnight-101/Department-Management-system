// src/controllers/attendanceController.js

import { Attendance } from "../models/attendence.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";

const populateAttendance = (query) => {
  return query
    .populate({ path: "attendanceStudent", select: "fullName _id" })
    .populate({ path: "attendanceSubject", select: "subjectName _id" })
    .populate({ path: "attendanceRecordedBy", select: "fullName _id" })
    .populate({ path: "attendanceCourse", select: "courseTitle _id" });
};

const addAttendance = asyncHandler(async (req, res) => {
  const {
    attendanceStudent,
    attendanceSubject,
    attendanceRecordedBy,
    attendanceCourse,
    attendanceSemester,
    attendanceDate,
    attendanceStatus,
  } = req.body;

  if (
    [
      attendanceStudent,
      attendanceSubject,
      attendanceRecordedBy,
      attendanceCourse,
      attendanceSemester,
      attendanceDate,
      attendanceStatus,
    ].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(
      400,
      "All required fields must be provided and cannot be empty."
    );
  }

  const dateObj = new Date(attendanceDate);
  if (isNaN(dateObj.getTime())) {
    throw new ApiError(400, "Invalid date format provided.");
  }

  const existedAttendance = await Attendance.findOne({
    attendanceStudent,
    attendanceSubject,
    attendanceDate: dateObj,
  });

  if (existedAttendance) {
    throw new ApiError(
      409,
      `Attendance for student ${attendanceStudent} in subject ${attendanceSubject} on ${dateObj.toDateString()} has already been marked.`
    );
  }

  const attendance = await Attendance.create({
    attendanceStudent,
    attendanceSubject,
    attendanceRecordedBy,
    attendanceCourse,
    attendanceSemester,
    attendanceDate: dateObj,
    attendanceStatus,
  });

  const createdAttendance = await populateAttendance(
    Attendance.findById(attendance._id)
  );

  if (!createdAttendance) {
    throw new ApiError(
      500,
      "Something went wrong while saving the attendance record."
    );
  }

  return res
    .status(201)
    .json(
      new Apiresponse(201, createdAttendance, "Attendance marked successfully.")
    );
});

const showAllAttendance = asyncHandler(async (req, res) => {
  const allAttendance = await populateAttendance(Attendance.find({}));
  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        allAttendance,
        allAttendance.length === 0
          ? "No attendance records found."
          : "Attendance records fetched successfully."
      )
    );
});

const getAttendanceById = asyncHandler(async (req, res) => {
  const attendanceId = req.params.id;
  if (!attendanceId) {
    throw new ApiError(400, "Attendance ID not provided.");
  }
  const attendance = await populateAttendance(Attendance.findById(attendanceId));
  if (!attendance) {
    throw new ApiError(404, "Attendance record not found.");
  }
  return res
    .status(200)
    .json(
      new Apiresponse(200, attendance, "Attendance record fetched successfully.")
    );
});

const editAttendance = asyncHandler(async (req, res) => {
  const attendanceId = req.params.id;
  const {
    attendanceStudent,
    attendanceSubject,
    attendanceRecordedBy,
    attendanceCourse,
    attendanceSemester,
    attendanceDate,
    attendanceStatus,
  } = req.body;

  if (!attendanceId) {
    throw new ApiError(400, "Attendance ID not provided.");
  }

  if (
    !(
      attendanceStudent ||
      attendanceSubject ||
      attendanceRecordedBy ||
      attendanceCourse ||
      attendanceSemester ||
      attendanceDate ||
      attendanceStatus
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  let dateObj;
  if (attendanceDate !== undefined) {
    dateObj = new Date(attendanceDate);
    if (isNaN(dateObj.getTime())) {
      throw new ApiError(400, "Invalid date format provided.");
    }
  }

  const updateData = {};
  if (attendanceStudent) updateData.attendanceStudent = attendanceStudent;
  if (attendanceSubject) updateData.attendanceSubject = attendanceSubject;
  if (attendanceRecordedBy) updateData.attendanceRecordedBy = attendanceRecordedBy;
  if (attendanceCourse) updateData.attendanceCourse = attendanceCourse;
  if (attendanceSemester) updateData.attendanceSemester = attendanceSemester;
  if (attendanceDate !== undefined) updateData.attendanceDate = dateObj;
  if (attendanceStatus) updateData.attendanceStatus = attendanceStatus;

  const updatedAttendance = await populateAttendance(
    Attendance.findByIdAndUpdate(
      attendanceId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
  );

  if (!updatedAttendance) {
    throw new ApiError(404, "Attendance record not found for update.");
  }

  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        updatedAttendance,
        "Attendance record updated successfully."
      )
    );
});

const attendanceCount = asyncHandler(async (req, res) => {
  const count = await Attendance.countDocuments();
  return res
    .status(200)
    .json(new Apiresponse(200, count, "Attendance count fetched successfully."));
});

export {
  addAttendance,
  showAllAttendance,
  getAttendanceById,
  editAttendance,
  attendanceCount,
};