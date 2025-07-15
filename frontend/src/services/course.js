import axios from "axios";

// Get total number of courses
export const countCourses = async () =>
  await axios
    .get("/api/course/count", {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);

// Get all courses
export const fetchCourses = async () =>
  await axios
    .get("/api/course", {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data.data);

// Add a new course
export const createCourse = async (courseData) => {
  const course = {
    courseCode: courseData?.courseCode,
    courseTitle: courseData?.courseTitle,
    courseDuration: courseData?.courseDuration,
    courseCreditUnits: courseData?.courseCreditUnits,
  };
  return await axios
    .post("/api/course/", course, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

// Remove a course
export const removeCourse = async (course) => {
  const { _id } = course;
  if (!_id) return console.warn("Missing course ID");
  return await axios.delete(`/api/course/${_id}`, {
    withCredentials: true, // ✅ Important for cookies/session
  });
};

// Update a course
export const updateCourse = async (updateData) => {
  const id = updateData?._id;
  const course = {
    courseCode: updateData?.courseCode,
    courseTitle: updateData?.courseTitle,
    courseDuration: updateData?.courseDuration,
    courseCreditUnits: updateData?.courseCreditUnits,
  };
  return await axios
    .patch(`/api/course/${id}`, course, {
      withCredentials: true, // ✅ Important for cookies/session
    })
    .then((res) => res.data);
};

export const courseList = async () => {
  const list = await axios.get("/api/course/list", {
    withCredentials: true, // ✅ Important for cookies/session
  });
  return list;
};
