import axios from "axios";

export const createAttendance = async (attendanceData) =>
  await axios.post("/api/attendance", attendanceData);

export const getAttendanceBYFilter = async (filterData) => {
  const queryFilter = {};
  if (filterData?.attendanceCourse)
    queryFilter.attendanceCourse = filterData?.attendanceCourse;
  if (filterData?.attendanceSubject)
    queryFilter.attendanceSubject = filterData?.attendanceSubject;
  if (filterData?.attendanceSemester)
    queryFilter.attendanceSemester = filterData?.attendanceSemester;
  if (filterData?.attendanceDate)
    queryFilter.attendanceDate = filterData?.attendanceDate;
  return await axios.post("/api/attendance/filter", queryFilter);
};

export const getAllAttendance = async () => await axios.get("/api/attendance");

export const updateAttendance = async (id, updateData) =>
  await axios.patch(`/api/attendance/${id}`, updateData);

export const getAttendanceCount = async () =>
  await axios.get("/api/attendance/count");
