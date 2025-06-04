import axios from "axios";

// STUDENT ROUTES
export const studentData = () => axios.get("/api/student");
export const studentById = (id) => axios.get(`/api/student/${id}`);
export const studentCount = () => axios.get("/api/student/count");
export const addStudent = (data) => axios.post("/api/student/", data);
export const updateStudent = (id, data) => axios.patch(`/api/student/${id}`, data);
export const deleteStudent = (id) => axios.delete(`/api/student/${id}`);

// SUBJECT ROUTES
export const subjectData = () => axios.get("/api/subjects");
export const subjectCount = () => axios.get("/api/subjects/count");
export const addSubject = (data) => axios.post("/api/subjects/", data);
export const updateSubject = (id, data) => axios.patch(`/api/subjects/${id}`, data);
export const deleteSubject = (id) => axios.delete(`/api/subjects/${id}`);

// COURSE ROUTES
export const courseData = () => axios.get("/api/course");
export const courseCount = () => axios.get("/api/course/count");
export const addCourse = (data) => axios.post("/api/course/", data);
export const updateCourse = (id, data) => axios.patch(`/api/course/${id}`, data);
export const courseById = (id) => axios.get(`/api/course/${id}`);
export const deleteCourse = (id) => axios.delete(`/api/course/${id}`);

// TEACHER ROUTES
export const getAllTeachers = () => axios.get("/api/teacher");
export const getTeacherData = (id) => axios.get(`/api/teacher/${id}`);
export const totalTeacherDocument = () => axios.get("/api/teacher/count");
export const registerTeacher = (formData) =>
  axios.post("/api/teacher/register", formData);
export const loginTeacher = (data) => axios.post("/api/teacher/login", data);
export const logoutTeacher = () => axios.post("/api/teacher/logout");
export const refreshAccessToken = () => axios.post("/api/teacher/refresh-token");
export const changePassword = (data) =>
  axios.patch("/api/teacher/change-password", data);
export const getCurrentTeacher = () => axios.get("/api/teacher/me");
export const updateTeacherDetails = (data) =>
  axios.patch("/api/teacher/update-details", data);
export const updateTeacherAvatar = (formData) =>
  axios.patch("/api/teacher/update-avatar", formData);

// Add other routes (attendance, grades, settings) as needed, following the same pattern.
