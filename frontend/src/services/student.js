import axios from "axios";

const studentCount = async () => {
  try {
    const response = await axios.get("/api/student/count");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { studentCount };
