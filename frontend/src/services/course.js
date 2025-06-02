import axios from "axios";

// Get total number of courses
const countCourses = async () => {
  try {
    const res = await axios.get("/api/course/count");
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Get all courses
const fetchCourses = async () => {
  try {
    const res = await axios.get("/api/course/get-course");
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

// Add a new course
const createCourse = async (courseData) => {
  try {
    const course = {
      ...courseData,
      courseCode: courseData?.courseCode,
      courseName: courseData?.courseName,
      academicYear: courseData?.academicYear,
      semester: courseData?.semester,
      subjects: courseData?.subjects || [],
      courseCredit: courseData?.courseCredit,
    };
    const res = await axios.post("/api/course/add-course", course);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Remove a course
const removeCourse = async (course) => {
  try {
    const { _id } = course;
    if (!_id) return console.warn("Missing course ID");
    const res = await axios.delete(_id);
    return res;
  } catch (err) {
    console.log("Error removing course", err);
  }
};
const updateCourse = async (updateData) => {
  try {
    const id = updateData?._id;
    const course = {
      ...updateData,
      courseCode: updateData?.courseCode,
      courseName: updateData?.courseName,
      academicYear: updateData?.academicYear,
      semester: updateData?.semester,
      subjects: updateData?.subjects || [],
      courseCredit: updateData?.courseCredit,
    };
    const { _id, ...courseData } = course;
    console.log("updation", courseData);

    const update = await axios.patch(`/api/course/${id}`, courseData);
    return update.data;
  } catch (error) {
    console.log(error);
  }
};
export { countCourses, fetchCourses, createCourse, removeCourse, updateCourse };
