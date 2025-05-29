import axios from "axios";

const subjectCount = async () => {
  try {
    const response = await axios.get("/api/subjects/count");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const subjectData = async () => {
  try {
    const response = await axios.get("/api/subjects/get-subjects");
    const output = response.data.data;
    return output;
  } catch (error) {
    console.log(error);
  }
};
export { subjectCount, subjectData };
