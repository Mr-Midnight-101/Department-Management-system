import axios from "axios";

// Get all teachers
export const getAllTeachers = () =>
  axios.get("/api/teacher/").then((res) => res.data.data);

// Get teacher count
export const getTeacherCount = () =>
  axios.get("/api/teacher/count").then((res) => res.data);

// Get teacher by ID
export const getTeacherById = (teacherId) =>
  axios.get(`/api/teacher/${teacherId}`).then((res) => res.data.data);

// Register a new teacher (with avatar upload)
export const registerTeacher = (formData) =>
  axios.post("/api/teacher/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);

// Login teacher
export const loginTeacher = (loginData) =>
  axios.post("/api/teacher/login", loginData).then((res) => res.data);

// Logout teacher
export const logoutTeacher = () =>
  axios.post("/api/teacher/logout").then((res) => res.data);

// Refresh access token
export const refreshAccessToken = (refreshToken) =>
  axios.post("/api/teacher/refresh-token", { refreshToken }).then((res) => res.data);

// Change password
export const changePassword = (passwordData) =>
  axios.patch("/api/teacher/change-password", passwordData).then((res) => res.data);

// Get current authenticated teacher
export const getCurrentTeacher = () =>
  axios.get("/api/teacher/me").then((res) => res.data.data);

// Update teacher details
export const updateTeacherDetails = (updateData) =>
  axios.patch("/api/teacher/update-details", updateData).then((res) => res.data);

// Update teacher avatar
export const updateTeacherAvatar = (formData) =>
  axios.patch("/api/teacher/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
