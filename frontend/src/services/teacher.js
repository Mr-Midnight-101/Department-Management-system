import axios from "axios";

const teacherList = async () => {
  const response = await axios.get("/api/getAlldata");
  return response.data;
};

const teacherID = async () => {
  const response = await axios.get("/api/getAlldata");
  return response.data;
};
const teacherLogin = async () => {
  const response = await axios.post("/api/getAlldata");
  return response.data;
};
const teacherLogout = async () => {
  const response = await axios.post("/api/getAlldata");
  return response.data;
};
const teacherUpdate = async () => {
  const response = await axios.put("/api/getAlldata");
  return response.data;
};

export { teacherList, teacherID, teacherLogin, teacherLogout, teacherUpdate };
