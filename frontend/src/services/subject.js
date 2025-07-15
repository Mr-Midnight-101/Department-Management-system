import axios from "axios";

// Get subject count
const subjectCount = async () => {
  const response = await axios.get("/api/subjects/count", {
    withCredentials: true, // ✅ Important for cookies/session
  });
  return response.data;
};

// Get all subjects
const getSubjects = async () => {
  const response = await axios.get("/api/subjects", {
    withCredentials: true, // ✅ Important for cookies/session
  });
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
  const response = await axios.post("/api/subjects", subject, {
    withCredentials: true, // ✅ Important for cookies/session
  });
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
  const response = await axios.patch(`/api/subjects/${id}`, data, {
    withCredentials: true, // ✅ Important for cookies/session
  });
  return response.data;
};

// Delete a subject
const deleteSubject = async (id) => {
  const response = await axios.delete(`/api/subjects/${id}`, {
    withCredentials: true, // ✅ Important for cookies/session
  });
  return response.data;
};

export { subjectCount, getSubjects, addSubject, updateSubject, deleteSubject };
