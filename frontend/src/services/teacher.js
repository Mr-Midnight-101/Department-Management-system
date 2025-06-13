import axios from "axios";

// Get all teachers
export const getAllTeachers = async () => {
  const dataset = await axios.get("/api/teacher");
  const res = dataset.data.data;
  return res;
};

// Get teacher count
export const getTeacherCount = async () => {
  return await axios.get("/api/teacher/count").then((res) => res.data);
};

// Get teacher by ID
export const getTeacherById = async (teacherId) => {
  const getTeacher = await axios
    .get(`/api/teacher/${teacherId}`)
    .then((res) => {
      console.log("getTeacher", res.data.data);
      res.data.data;
    });
  return getTeacher;
};

// Register a new teacher (with avatar upload)
export const registerTeacher = async (formData, file) => {
  if (!formData) {
    return "user register data is empty";
  }
  console.log("file", file);

  const teacher = {
    ...formData,
    teacherFullName: formData?.teacherFullName,
    teacherEmail: formData?.teacherEmail,
    teacherUsername: formData?.teacherUsername,
    teacherPassword: formData?.teacherPassword,
    teacherId: formData?.teacherId,
    teacherContactInfo: formData?.teacherContactInfo,
    teacherAvatar: file,
  };
  console.log("teacher", teacher);

  const fetch = await axios.post("/api/teacher/register", teacher, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return fetch;
};

// Login teacher
export const loginTeacher = async (teacher) => {
  console.log("axios", axios);
  console.log("axios", (axios.defaults.withCredentials = true));

  const login = await axios.post("/api/teacher/login", teacher, {
    withCredentials: true,
  });
  return login;
};
// Logout teacher
export const logoutTeacher = async () => {
  const logout = await axios.post("/api/teacher/logout");
  return logout;
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  const refresh = await axios
    .post("/api/teacher/refresh-token", { refreshToken })
    .then((res) => {
      console.log("refreshAccessToken", res.data);
      res.data;
    });
  return refresh;
};

// Change password
export const changePassword = async (passwordData) => {
  const password = {
    ...passwordData,
    oldPassword: passwordData?.oldPassword,
    newPassword: passwordData?.newPassword,
  };
  const passChange = await axios
    .patch("/api/teacher/change-password", password)
    .then((res) => {
      console.log("change password", res.data);
      res.data;
    });
  return passChange;
};

// Get current authenticated teacher
export const getCurrentTeacher = async () => {
  const current = await axios.get("/api/teacher/user").then((res) => {
    console.log("current user", res.data);
    res.data.data;
  });
  return current;
};

// Update teacher details

export const updateTeacherDetails = async (updateData) => {
  const { id } = updateData._id;
  const teacher = {
    ...updateData,
    teacherFullName: updateData?.teacherFullName,
    teacherEmail: updateData?.teacherEmail,
    teacherUsername: updateData?.teacherUsername,
    teacherPassword: updateData?.teacherPassword,
    teacherContactInfo: updateData?.teacherContactInfo,
    teacherAssignedSubjects: updateData?.teacherAssignedSubjects,
  };
  const { _id, ...data } = teacher;
  const update = await axios
    .patch(`/api/teacher/update-details/${id}`, data)
    .then((res) => {
      console.log("update response", res.data);
      res.data;
    });
  return update;
};

// Update teacher avatar
export const updateTeacherAvatar = async (avatarPic) => {
  const picture = {
    ...avatarPic,
    teacherAvatar: avatarPic?.teacherAvatar,
  };
  const update = await axios
    .patch("/api/teacher/update-avatar", picture, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      console.log("avatar update", res.data);
      res.data;
    });
  return update;
};
