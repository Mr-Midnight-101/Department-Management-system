/* eslint-disable no-unused-vars */
import axios from "axios";

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
    StudentCurrentSemester: registerData?.StudentCurrentSemester,
  };

  console.log("student just before api call", student);
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
    StudentCurrentSemester: updateData?.StudentCurrentSemester,
  };
  const { _id, ...data } = student;
  return await axios
    .patch(`/api/student/${id}`, data, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

export const deleteStudent = async (student) => {
  const { _id } = student;
  return await axios
    .delete(`/api/student/${_id}`, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

export const filterStudentByCourse = async (filter) => {
  console.log("front services", filter?.courseName);

  const studentData = {
    courseName: filter?.courseName,
  };
  if (filter?.semester) {
    studentData.semester = filter?.semester;
  }
  return await axios.post("/api/student/filter", studentData, {
    withCredentials: true,
  });
};
