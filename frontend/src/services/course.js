import axios from "axios";

const courseCount = async () => {
  try {
    const response = await axios.get("/api/course/count");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const courseData = async () => {
  try {
    const response = await axios.get("/api/course/get-course");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const courseAdd = async (student) => {
  try {
    const response = await axios.post("/api/course/add-course", student);
    const output = response.data;
    return output;
  } catch (error) {
    console.log(error);
  }
};
export { courseCount, courseData, courseAdd };
