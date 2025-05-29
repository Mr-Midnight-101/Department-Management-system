/* eslint-disable no-unused-vars */
import axios from "axios";

const studentCount = async () => {
  try {
    const response = await axios.get("/api/student/count");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getStudents = async () => {
  try {
    const response = await axios.get("/api/student/");
    const output = response.data.data;
    return output;
  } catch (error) {
    console.log(error);
  }
};

const studentRegister = async (registerData) => {
  console.log("This is api call from register Services ", registerData);

  try {
    const student = {
      ...registerData,
      fullName: registerData.fullName,
      dateOfBirth: registerData.dateOfBirth,
      enrollmentNo: registerData.enrollmentNo,
      rollNo: registerData.rollNo,
      email: registerData.email,
      contactInfo: registerData.contactInfo,
      fatherName: registerData.fatherName,
      fullAdd: {
        ...registerData.fullAdd,
        city: registerData.fullAdd.city,
        state: registerData.fullAdd.state,
        country: registerData.fullAdd?.country,
        postalCode: registerData.fullAdd?.postalCode,
      },
      category: registerData.category,
      studentType: registerData.studentType,
      admissionYear: registerData.admissionYear,
    };
    const register = await axios.post("/api/student/", student);
    const output = register;
    return output;
  } catch (error) {
    console.log(error);
  }
};

const updateStudentDetails = async (updateData) => {
  console.log("This is api call from update Services ", updateData);

  try {
    const id = updateData?._id;
    const student = {
      ...updateData,
      fullName: updateData.fullName,
      dateOfBirth: updateData.dateOfBirth,
      enrollmentNo: updateData.enrollmentNo,
      rollNo: updateData.rollNo,
      email: updateData.email,
      contactInfo: updateData.contactInfo,
      fatherName: updateData.fatherName,
      fullAdd: {
        ...updateData.fullAdd,
        city: updateData.fullAdd?.city,
        state: updateData.fullAdd?.state,
        country: updateData.fullAdd?.country,
        postalCode: updateData.fullAdd?.postalCode,
      },
      category: updateData.category,
      studentType: updateData.studentType,
      admissionYear: updateData.admissionYear,
    };

    // Remove _id from the body
    const { _id, ...studentData } = student;

    console.log(
      "student after setting data from frontend call to backend update services",
      studentData
    );

    const update = await axios.patch(`/api/student/${id}`, studentData);
    return update.data;
  } catch (error) {
    console.log(error);
  }
};
export { studentCount, getStudents, studentRegister, updateStudentDetails };
