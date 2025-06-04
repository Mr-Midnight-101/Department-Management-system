import axios from "axios";

export const createAttendance = (attendanceData) =>
  axios.post("/api/attendance", attendanceData);

export const getAllAttendance = () => axios.get("/api/attendance");

export const getAttendanceById = (id) => axios.get(`/api/attendance/${id}`);

export const updateAttendance = (id, updateData) =>
  axios.patch(`/api/attendance/${id}`, updateData);

export const getAttendanceCount = () => axios.get("/api/attendance/count");
