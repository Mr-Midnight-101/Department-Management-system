import axios from "axios";

// Get subject count
const subjectCount = async () => {
  const response = await axios.get("/api/subjects/count");
  return response.data;
};

// Get all subjects
const getSubjects = async () => {
  const response = await axios.get("/api/subjects/");
  return response.data.data;
};

// Add a new subject
const addSubject = async (subjectData) => {
  const subject = {
    ...subjectData,
    subjectCode: subjectData?.subjectCode,
    subjectName: subjectData?.subjectName,
    subjectMaxMarksTheory: subjectData?.subjectMaxMarksTheory,
    subjectMaxMarksPractical: subjectData?.subjectMaxMarksPractical,
    subjectCreditPoints: subjectData?.subjectCreditPoints,
  };
  const response = await axios.post("/api/subjects/", subject);
  return response.data;
};

// Update a subject
const updateSubject = async (id, subjectData) => {
  const subject = {
    ...subjectData,

    subjectCode: subjectData?.subjectCode,
    subjectName: subjectData?.subjectName,
    subjectMaxMarksTheory: subjectData?.subjectMaxMarksTheory,
    subjectMaxMarksPractical: subjectData?.subjectMaxMarksPractical,
    subjectCreditPoints: subjectData?.subjectCreditPoints,
  };
  const { _id, ...data } = subject;
  const response = await axios.patch(`/api/subjects/${id}`, data);
  return response.data;
};

// Delete a subject
const deleteSubject = async (id) => {
  const response = await axios.delete(`/api/subjects/${id}`);
  return response.data;
};

export { subjectCount, getSubjects, addSubject, updateSubject, deleteSubject };
