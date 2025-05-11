// src/controllers/student.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Student } from "../models/student.model.js";
// Imports for authentication-related models/utilities are removed

// ⭐ Helper function to populate student details
const populateStudent = (query) => {
  return query.populate("currentCourse", "courseName courseCode"); // Populate course name and code
};

// ⭐ Controller to add a new student record (likely by an admin/teacher)
const addStudent = asyncHandler(async (req, res) => {
  // Extract necessary fields from the request body
  const {
    fullName,
    // username, password are NOT expected for students
    dateOfBirth,
    enrollmentNo,
    rollNo,
    email,
    contactInfo,
    fatherName,
    fullAdd, // fullAdd is expected as an object
    category,
    semester,
    currentCourse, // currentCourse ID
    studentType,
    admissionYear,
  } = req.body;

  // Validate required fields based on the updated schema (no username/password)
  const requiredFields = [
    "fullName",
    "dateOfBirth",
    "enrollmentNo",
    "rollNo",
    "email",
    "contactInfo",
    "fatherName",
    "fullAdd",
    "category",
    "semester",
    "currentCourse",
    "studentType",
    "admissionYear",
  ];

  const missingField = requiredFields.find((fieldName) => {
    const field = req.body[fieldName];
    if (field === undefined || field === null) return fieldName;
    if (typeof field === "string" && field.trim() === "") return fieldName;
    // For fullAdd, check if it's a non-empty object with required sub-fields
    if (fieldName === "fullAdd") {
      if (typeof field !== "object" || field === null) return fieldName;
      // Check required sub-fields of fullAdd based on schema
      const requiredAddressFields = ["city", "state", "country"]; // Based on schema required fields
      const missingAddressField = requiredAddressFields.find((subFieldName) => {
        const subField = field[subFieldName];
        return (
          subField === undefined ||
          subField === null ||
          (typeof subField === "string" && subField.trim() === "")
        );
      });
      if (missingAddressField) return `fullAdd.${subFieldName}`; // Return specific sub-field name
    }
    return false; // Field is present and not an empty string
  });

  if (missingField) {
    throw new ApiError(
      400,
      `Required field '${missingField}' cannot be empty.`
    );
  }

  // Validate Date of Birth format (basic check)
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) {
    throw new ApiError(400, "Invalid date of birth format.");
  }

  // Validate admissionYear is a number
  if (
    typeof admissionYear !== "number" ||
    admissionYear < 1900 ||
    admissionYear > new Date().getFullYear() + 1
  ) {
    throw new ApiError(400, "Invalid admission year.");
  }

  // Check if student already exists by unique fields (enrollmentNo, rollNo, email, contactInfo)
  // Removed username from the check
  const existStudent = await Student.findOne({
    $or: [
      { enrollmentNo: enrollmentNo.trim().toUpperCase() },
      { rollNo: rollNo.trim().toUpperCase() },
      { email: email.trim().toLowerCase() },
      { contactInfo: contactInfo.trim() },
    ],
  });

  if (existStudent) {
    let errorMessage = "A student with these details already exists.";
    if (existStudent.enrollmentNo === enrollmentNo.trim().toUpperCase())
      errorMessage = `Student with Enrollment Number '${enrollmentNo
        .trim()
        .toUpperCase()}' already exists.`;
    else if (existStudent.rollNo === rollNo.trim().toUpperCase())
      errorMessage = `Student with Roll Number '${rollNo
        .trim()
        .toUpperCase()}' already exists.`;
    else if (existStudent.email === email.trim().toLowerCase())
      errorMessage = `Student with Email '${email
        .trim()
        .toLowerCase()}' already exists.`;
    else if (existStudent.contactInfo === contactInfo.trim())
      errorMessage = `Student with Contact Info '${contactInfo.trim()}' already exists.`;

    throw new ApiError(409, errorMessage); // Use 409 Conflict
  }

  // Create the new student document
  // No password hashing needed
  const student = await Student.create({
    fullName: fullName.trim().toLowerCase(), // Trim and lowercase
    dateOfBirth: dob, // Use the validated Date object
    enrollmentNo: enrollmentNo.trim().toUpperCase(), // Trim and uppercase
    rollNo: rollNo.trim().toUpperCase(), // Trim and uppercase
    email: email.trim().toLowerCase(), // Trim and lowercase
    contactInfo: contactInfo.trim(), // Trim
    fatherName: fatherName.trim().toLowerCase(), // Trim and lowercase
    fullAdd: {
      street: fullAdd.street?.trim().toLowerCase(), // Trim and lowercase if provided
      city: fullAdd.city.trim().toLowerCase(), // Trim and lowercase (required by schema)
      state: fullAdd.state.trim().toLowerCase(), // Trim and lowercase (required by schema)
      postalCode: fullAdd.postalCode?.trim().toLowerCase(), // Trim and lowercase if provided
      country: fullAdd.country.trim().toLowerCase(), // Trim and lowercase (required by schema)
    },
    category: category.trim().toUpperCase(), // Trim and uppercase
    semester: semester.trim(), // Trim (ensure casing matches schema enum)
    currentCourse, // Use the provided Course ID
    studentType: studentType.trim(), // Trim (ensure casing matches schema enum)
    admissionYear,
  });

  // Fetch the created student record with populated course details
  const createdStudent = await populateStudent(Student.findById(student._id));

  // Check if the student record was successfully created and fetched
  if (!createdStudent) {
    throw new ApiError(
      500,
      "An unexpected error occurred while adding the student. Please try again later."
    );
  }

  // Return a success response with the created student data
  return res
    .status(201) // Use 201 Created
    .json(
      new Apiresponse(
        201,
        createdStudent,
        "Student has been added successfully."
      )
    );
});

// ⭐ Controller to get all student records
const getAllStudents = asyncHandler(async (req, res) => {
  // Implement fetching all student records
  // Can add filtering, sorting, and pagination here based on requirements

  const filter = {}; // Start with an empty filter
  // Example filtering from query parameters:
  // if (req.query.courseId) filter.currentCourse = req.query.courseId;
  // if (req.query.semester) filter.semester = req.query.semester;
  // if (req.query.admissionYear) filter.admissionYear = parseInt(req.query.admissionYear);

  const allStudents = await populateStudent(Student.find(filter));

  if (!allStudents || allStudents.length === 0) {
    return res
      .status(200)
      .json(new Apiresponse(200, [], "No student records found."));
  }

  return res
    .status(200)
    .json(
      new Apiresponse(200, allStudents, "Student records fetched successfully.")
    );
});

// ⭐ Controller to get a specific student record by ID
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

// ⭐ Controller to update a student record by ID (likely by an admin/teacher)
const updateStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  if (!studentId) {
    throw new ApiError(400, "Student ID not provided for update.");
  }

  // Get updatable fields from request body
  const {
    fullName,
    // username, password, refreshToken are NOT updatable for students
    dateOfBirth,
    enrollmentNo,
    rollNo,
    email,
    contactInfo,
    fatherName,
    fullAdd, // fullAdd expected as object
    category,
    semester,
    currentCourse, // currentCourse ID
    studentType,
    admissionYear,
  } = req.body;

  // Basic validation: Check if at least one field is provided for update
  if (
    !(
      fullName ||
      dateOfBirth ||
      enrollmentNo ||
      rollNo ||
      email ||
      contactInfo ||
      fatherName ||
      fullAdd ||
      category ||
      semester ||
      currentCourse ||
      studentType ||
      admissionYear
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  // Optional: Add more specific validation for each field if it's provided in the body
  if (dateOfBirth !== undefined) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new ApiError(400, "Invalid date of birth format.");
    }
    // Store the validated date object temporarily
    req.body.dateOfBirth = dob;
  }

  if (
    admissionYear !== undefined &&
    (typeof admissionYear !== "number" ||
      admissionYear < 1900 ||
      admissionYear > new Date().getFullYear() + 1)
  ) {
    throw new ApiError(400, "Invalid admission year.");
  }

  if (
    fullAdd !== undefined &&
    (typeof fullAdd !== "object" || fullAdd === null)
  ) {
    throw new ApiError(400, "Full address must be an object.");
  }
  // Optional: Validate required sub-fields of fullAdd if provided in update

  // Find the student by ID and update it
  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        ...(fullName && { fullName: fullName.trim().toLowerCase() }),
        ...(dateOfBirth && { dateOfBirth: req.body.dateOfBirth }), // Use the validated date object
        ...(enrollmentNo && {
          enrollmentNo: enrollmentNo.trim().toUpperCase(),
        }),
        ...(rollNo && { rollNo: rollNo.trim().toUpperCase() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(contactInfo && { contactInfo: contactInfo.trim() }),
        ...(fatherName && { fatherName: fatherName.trim().toLowerCase() }),
        ...(fullAdd && {
          fullAdd: {
            // Basic update of fullAdd object - assumes sending the whole object
            street: fullAdd.street?.trim().toLowerCase(),
            city: fullAdd.city?.trim().toLowerCase(),
            state: fullAdd.state?.trim().toLowerCase(),
            postalCode: fullAdd.postalCode?.trim().toLowerCase(),
            country: fullAdd.country?.trim().toLowerCase(),
          },
        }),
        ...(category && { category: category.trim().toUpperCase() }),
        ...(semester && { semester: semester.trim() }),
        ...(currentCourse && { currentCourse }),
        ...(admissionYear !== undefined && { admissionYear }),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("currentCourse", "courseName courseCode");

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
    .json(new Apiresponse(200, count, "Document count successfully"));
});

// Export all relevant controller functions
export {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  studentCount,
};
