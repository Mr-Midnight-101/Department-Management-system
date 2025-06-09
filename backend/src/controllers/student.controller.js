import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Student } from "../models/student.model.js";
import dayjs from "dayjs";
import { capitalize } from "../utils/capitalize.js";

const populateStudent = (query) => {
  return query.populate({
    path: "studentCurrentCourseId",
    select: "courseCode _id",
  });
};

const addStudent = asyncHandler(async (req, res) => {
  const {
    studentFullName,
    studentDateOfBirth,
    studentEnrollmentNumber,
    studentRollNumber,
    studentEmail,
    studentContactNumber,
    studentFatherName,
    studentAddress,
    studentCategory,
    studentCurrentCourseId,
    studentType,
    studentAdmissionYear,
  } = req.body;

  const requiredFields = [
    studentFullName,
    studentEnrollmentNumber,
    studentRollNumber,
    studentEmail,
    studentContactNumber,
    studentFatherName,
  ];

  if (requiredFields.some((field) => field?.trim() == "" || field == null)) {
    throw new ApiError(400, `All required fields must be filled.`);
  }

  if (
    [studentType, studentCategory, studentAdmissionYear].some(
      (field) => field == null
    )
  ) {
    throw new ApiError(400, `All required fields must be filled.`);
  }

  if (!dayjs(studentDateOfBirth).isValid()) {
    throw new ApiError(400, "Invalid date format for date of birth.");
  }

  const existStudent = await Student.aggregate([
    {
      $match: {
        $expr: {
          $or: [
            {
              $eq: [
                "$studentEnrollmentNumber",
                studentEnrollmentNumber.trim().toUpperCase(),
              ],
            },
            {
              $eq: [
                "$studentRollNumber",
                studentRollNumber.trim().toUpperCase(),
              ],
            },
            { $eq: ["$studentEmail", studentEmail.trim().toLowerCase()] },
            { $eq: ["$studentContactNumber", studentContactNumber.trim()] },
          ],
        },
      },
    },
  ]);

  if (existStudent.length > 0) {
    const match = existStudent[0];
    let errorMessage = "A student with these details already exists.";

    if (
      match.studentEnrollmentNumber === studentEnrollmentNumber.toUpperCase()
    ) {
      errorMessage = `Student with Enrollment Number '${studentEnrollmentNumber
        .trim()
        .toUpperCase()}' already exists.`;
    } else if (match.studentRollNumber === studentRollNumber.toUpperCase()) {
      errorMessage = `Student with Roll Number '${studentRollNumber
        .trim()
        .toUpperCase()}' already exists.`;
    } else if (match.studentEmail === studentEmail.toLowerCase()) {
      errorMessage = `Student with Email '${studentEmail
        .trim()
        .toLowerCase()}' already exists.`;
    } else if (match.studentContactNumber === studentContactNumber.trim()) {
      errorMessage = `Student with Contact Number '${studentContactNumber.trim()}' already exists.`;
    }

    throw new ApiError(409, errorMessage);
  }

  const createdStudent = await Student.create({
    studentFullName: capitalize(studentFullName.trim()),
    studentDateOfBirth,
    studentEnrollmentNumber: studentEnrollmentNumber.trim().toUpperCase(),
    studentRollNumber: studentRollNumber.trim().toUpperCase(),
    studentEmail: studentEmail.trim().toLowerCase(),
    studentContactNumber: studentContactNumber.trim(),
    studentFatherName: capitalize(studentFatherName.trim()),
    studentAddress: {
      city: capitalize(studentAddress?.city?.trim()) || "",
      state: capitalize(studentAddress?.state?.trim()) || "",
      postalCode: studentAddress?.postalCode?.trim() || "",
      country: studentAddress?.country?.trim().toUpperCase() || "INDIA",
    },
    studentCategory: studentCategory || "GEN",
    studentCurrentCourseId: studentCurrentCourseId || "",
    studentType: studentType || "Regular",
    studentAdmissionYear: studentAdmissionYear || new Date().getFullYear(),
  });

  const student = await populateStudent(Student.findById(createdStudent._id));

  if (!student || student.length === 0) {
    throw new ApiError(
      500,
      "An unexpected error occurred while adding the student."
    );
  }

  return res
    .status(201)
    .json(
      new Apiresponse(201, student, "Student has been added successfully.")
    );
});

const getAllStudents = asyncHandler(async (req, res) => {
  const allStudents = await populateStudent(Student.find({}));
  return res
    .status(200)
    .json(
      new Apiresponse(200, allStudents, "Student records fetched successfully.")
    );
});

const getStudentById = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  if (!studentId) {
    throw new ApiError(400, "Student ID not provided.");
  }
  const student = await populateStudent(Student.findById(studentId));
  if (!student) {
    throw new ApiError(404, "Student data not found.");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, student, "Student found successfully."));
});

const updateStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  if (!studentId) {
    throw new ApiError(400, "Student ID not provided for update.");
  }

  const {
    studentFullName,
    studentDateOfBirth,
    studentEnrollmentNumber,
    studentRollNumber,
    studentEmail,
    studentContactNumber,
    studentFatherName,
    studentAddress,
    studentCategory,
    studentCurrentCourseId,
    studentType,
    studentAdmissionYear,
  } = req.body;

  if (
    !(
      studentFullName ||
      studentDateOfBirth ||
      studentEnrollmentNumber ||
      studentRollNumber ||
      studentEmail ||
      studentContactNumber ||
      studentFatherName ||
      studentAddress ||
      studentCategory ||
      studentCurrentCourseId ||
      studentType ||
      studentAdmissionYear
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  if (
    studentDateOfBirth !== undefined &&
    !dayjs(studentDateOfBirth).isValid()
  ) {
    throw new ApiError(400, "Invalid date of birth format.");
  }

  if (
    studentAdmissionYear !== undefined &&
    (typeof studentAdmissionYear !== "number" ||
      studentAdmissionYear < 1900 ||
      studentAdmissionYear > new Date().getFullYear() + 1)
  ) {
    throw new ApiError(400, "Invalid admission year.");
  }

  if (
    studentAddress !== undefined &&
    (typeof studentAddress !== "object" || studentAddress === null)
  ) {
    throw new ApiError(400, "Student address must be an object.");
  }

  const updatedStudent = await populateStudent(
    Student.findByIdAndUpdate(
      studentId,
      {
        $set: {
          ...(studentFullName?.trim() && {
            studentFullName: capitalize(studentFullName.trim()),
          }),
          ...(studentDateOfBirth && { studentDateOfBirth }),
          ...(studentEnrollmentNumber?.trim() && {
            studentEnrollmentNumber: studentEnrollmentNumber
              .trim()
              .toUpperCase(),
          }),
          ...(studentRollNumber?.trim() && {
            studentRollNumber: studentRollNumber.trim().toUpperCase(),
          }),
          ...(studentEmail?.trim() && {
            studentEmail: studentEmail.trim().toLowerCase(),
          }),
          ...(studentContactNumber?.trim() && {
            studentContactNumber: studentContactNumber.trim(),
          }),
          ...(studentFatherName?.trim() && {
            studentFatherName: capitalize(studentFatherName.trim()),
          }),
          ...(studentAddress && {
            studentAddress: {
              city: capitalize(studentAddress.city?.trim()) || "",
              state: capitalize(studentAddress.state?.trim()) || "",
              postalCode: studentAddress.postalCode?.trim() || "",
              country: studentAddress.country?.trim().toUpperCase() || "INDIA",
            },
          }),
          ...(studentCategory && { studentCategory }),
          ...(studentType && { studentType }),
          ...((studentCurrentCourseId && {
            studentCurrentCourseId,
          }) ||
            ""),
          ...(studentAdmissionYear !== undefined && { studentAdmissionYear }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
  );

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found for update.");
  }

  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        updatedStudent,
        "Student details updated successfully."
      )
    );
});

const studentCount = asyncHandler(async (req, res) => {
  const count = await Student.countDocuments();
  return res
    .status(200)
    .json(new Apiresponse(200, count, "Student count fetched successfully."));
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Id is empty");

  const student = await populateStudent(Student.findByIdAndDelete(id));

  if (!student) throw new ApiError(404, "Cannot find student");
  return res
    .status(200)
    .json(new Apiresponse(200, student, "Student deleted successfully"));
});

export {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  studentCount,
  deleteStudent,
};
