/* eslint-disable no-unused-vars */
import axios from "axios";
import { createAttendance } from "./attendance";

export const studentCount = async () =>
  await axios
    .get("/api/student/count", {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);

export const getStudents = async () =>
  await axios
    .get("/api/student", {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data.data);

export const studentRegister = async (registerData) => {
  const student = {
    studentFullName: registerData?.studentFullName,
    studentDateOfBirth: registerData?.studentDateOfBirth,
    studentEnrollmentNumber: registerData?.studentEnrollmentNumber,
    studentRollNumber: registerData?.studentRollNumber,
    studentEmail: registerData?.studentEmail,
    studentContactNumber: registerData?.studentContactNumber,
    studentFatherName: registerData?.studentFatherName,
    studentAddress: {
      ...registerData.studentAddress,
      city: registerData.studentAddress?.city,
      state: registerData.studentAddress?.state,
      country: registerData.studentAddress?.country,
      postalCode: registerData.studentAddress?.postalCode,
    },
    studentCategory: registerData?.studentCategory,
    studentCurrentCourseId: registerData?.studentCurrentCourseId,
    studentType: registerData?.studentType,
    studentAdmissionYear: registerData?.studentAdmissionYear,
    studentCurrentSemester: registerData?.studentCurrentSemester,
  };
  const attendanceData = {
    attendanceStudent: registerData?.studentFullName,
    attendanceCourse: registerData?.studentCurrentCourseId,
    attendanceSemester: registerData?.studentCurrentSemester,
  };
  console.log("student attendance just before api call", attendanceData);
  await axios.post("/api/attendance", attendanceData);
  return await axios.post("/api/student", student, {
    withCredentials: true, // ✅ Important for cookies/session
  });
};

export const updateStudentDetails = async (updateData) => {
  const id = updateData?._id;
  const student = {
    studentFullName: updateData?.studentFullName,
    studentDateOfBirth: updateData?.studentDateOfBirth,
    studentEnrollmentNumber: updateData?.studentEnrollmentNumber,
    studentRollNumber: updateData?.studentRollNumber,
    studentEmail: updateData?.studentEmail,
    studentContactNumber: updateData?.studentContactNumber,
    studentFatherName: updateData?.studentFatherName,
    studentAddress: {
      street: updateData?.studentAddress?.street,
      city: updateData?.studentAddress?.city,
      state: updateData?.studentAddress?.state,
      country: updateData?.studentAddress?.country,
      postalCode: updateData?.studentAddress?.postalCode,
    },
    studentCategory: updateData?.studentCategory,
    studentCurrentCourseId: updateData?.studentCurrentCourseId,
    studentType: updateData?.studentType,
    studentAdmissionYear: updateData?.studentAdmissionYear,
    studentCurrentSemester: updateData?.studentCurrentSemester,
  };
  const { _id, ...data } = student;
  return await axios
    .patch(`/api/student/${id}`, data, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

export const deleteStudent = async (student) => {
  console.log("api", student);

  const { _id } = student;
  return await axios
    .delete(`/api/student/${_id}`, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

export const filterStudent = async (filter = {}) => {
  const payload = {};

  if (filter?.studentCurrentCourseId) {
    payload.studentCurrentCourseId = filter.studentCurrentCourseId;
  }

  if (filter?.studentCurrentSemester) {
    payload.studentCurrentSemester = filter.studentCurrentSemester;
  }

  return await axios.post("/api/student/filter", payload, {
    withCredentials: true,
  });
};
