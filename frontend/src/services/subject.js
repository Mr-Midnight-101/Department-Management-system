import axios from "axios";

const subjectCount = async () => {
  try {
    const response = await axios.get("/api/subjects/count");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { subjectCount };
