import { Attendance } from "../models/attendence.model.js";

const addAttendance = async (req, res) => {
  const {
    attendanceStudent,
    attendanceRecordedBy,
    attendanceCourse,
    attendanceSemester,
    attendanceStatus,
    attendanceDate,
  } = req.body;

  const data = await Attendance.create({
    attendanceStudent: attendanceStudent,
    attendanceRecordedBy: attendanceRecordedBy,
    attendanceCourse: attendanceCourse,
    attendanceSemester: attendanceSemester,
    attendanceStatus: attendanceStatus,
    attendanceDate: attendanceDate,
  });

  const attend = await Attendance.findOne(data._id);

  res.status(200).json({ attend });
};
const editAttendance = () => {};
const showAllAttendance = async (req, res) => {
  const attend = await Attendance.find();
  console.log(attend);
};
const attendanceCount = () => {};
const getAttendanceById = () => {};
const filterAttendance = () => {};

export {
  addAttendance,
  showAllAttendance,
  getAttendanceById,
  editAttendance,
  attendanceCount,
  filterAttendance,
};
