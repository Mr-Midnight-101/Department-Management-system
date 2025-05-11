import axios from "axios";

const courseCount = async () => {
  try {
    const response = await axios.get("/api/course/count");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { courseCount };
