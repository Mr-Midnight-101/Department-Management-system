// src/controllers/subject.controller.js // Corrected file name reference

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Subject } from "../models/subject.model.js";
// Teacher model might be needed for validation or population, already referenced
// import { Teacher } from "../models/teacher.model.js";

// ⭐ Helper function to populate subject details
const populateSubject = (query) => {
  return query.populate("subjectTeacher", "fullName teacherId"); // Populate teacher's name and ID
};

// ⭐ Controller to add a new subject
const addSubject = asyncHandler(async (req, res) => { // Renamed function
  // Extract necessary fields from the request body
  const {
    subjectCode,
    subjectName,
    maxMarksTheory, // Corrected field name
    maxMarksPractical, // Corrected field name
    subCredit,
    // subjectTeacher can optionally be provided during creation or added later
    subjectTeacher // Assuming an array of teacher IDs might be sent
  } = req.body;

  // Validate required fields
  if (
    [subjectCode, subjectName, maxMarksTheory, maxMarksPractical, subCredit].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    const missingField = [subjectCode, subjectName, maxMarksTheory, maxMarksPractical, subCredit].find(
        (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    );
    throw new ApiError(400, `Required field '${missingField || "One or more required fields"}' cannot be empty.`);
  }

  // Validate number fields
  if (typeof maxMarksTheory !== 'number' || maxMarksTheory < 0) {
       throw new ApiError(400, "Invalid value for theory marks.");
  }
   if (typeof maxMarksPractical !== 'number' || maxMarksPractical < 0) {
       throw new ApiError(400, "Invalid value for practical marks.");
  }
    if (typeof subCredit !== 'number' || subCredit < 0) {
       throw new ApiError(400, "Invalid value for subject credit.");
  }

   // Validate subjectTeacher if provided - ensure it's an array of ObjectIds (basic check)
  if (subjectTeacher !== undefined && !Array.isArray(subjectTeacher)) {
      throw new ApiError(400, "Subject teachers must be provided as an array.");
  }
  // Further validation: check if teacher IDs are valid ObjectIds if needed

  // Check if the subject already exists by code or name
  const existedSubject = await Subject.findOne({
    $or: [
        { subjectCode: subjectCode.trim().toUpperCase() }, // Check uppercase code
        { subjectName: subjectName.trim() } // Check trimmed name
    ],
  });

  if (existedSubject) {
    // Provide more specific error message
     let errorMessage = "Subject already exists.";
     if (existedSubject.subjectCode === subjectCode.trim().toUpperCase()) errorMessage = `Subject with code '${subjectCode.trim().toUpperCase()}' already exists.`;
     else if (existedSubject.subjectName === subjectName.trim()) errorMessage = `Subject with name '${subjectName.trim()}' already exists.`;
    throw new ApiError(409, errorMessage); // Use 409 Conflict
  }

  // Create the new subject document
  const subject = await Subject.create({
    subjectCode: subjectCode.trim().toUpperCase(), // Trim and uppercase code
    subjectName: subjectName.trim(), // Trim name
    maxMarksTheory, // Use corrected field name
    maxMarksPractical, // Use corrected field name
    subCredit,
    subjectTeacher: subjectTeacher || [], // Use provided teacher array or empty array
  });

  // Fetch the created subject record with populated teacher details
  const createdSubject = await populateSubject(
    Subject.findById(subject._id)
  );

  // Check if subject creation was successful
  if (!createdSubject) {
    // If findById fails after create, something went wrong during save
    throw new ApiError(500, "Something went wrong while adding the subject.");
  }

  // Return a success response with the created subject data
  return res
    .status(201) // Use 201 Created for successful resource creation
    .json(new Apiresponse(201, createdSubject, "Subject added successfully."));
});

// ⭐ Controller to get all subject records
const getAllSubjects = asyncHandler(async (req, res) => {
  // Implement fetching all subject records
  // Can add filtering, sorting, and pagination here based on requirements

  const filter = {}; // Start with an empty filter
  // Example filtering from query parameters:
  // if (req.query.teacherId) filter.subjectTeacher = req.query.teacherId;


  const allSubjects = await populateSubject(Subject.find(filter)); // Fetch all (or filtered) and populate

  // ⭐ FIX: Send a response even if no subjects are found
  if (!allSubjects || allSubjects.length === 0) {
    return res
      .status(200) // Use 200 OK even if empty
      .json(new Apiresponse(200, [], "No subjects found."));
  }

  // Return success response with all subjects
  return res
    .status(200)
    .json(
      new Apiresponse(200, allSubjects, "Subjects fetched successfully.")
    );
});

// ⭐ Controller to get a specific subject record by ID
const getSubjectById = asyncHandler(async (req, res) => { // Renamed function
  // Get the subject ID from the URL parameters
  const subjectId = req.params.id;

  // Validate that an ID was provided
  if (!subjectId) {
    throw new ApiError(400, "Subject ID not provided."); // Use 400 for bad request (missing ID)
  }

  // Find the subject by ID and populate teacher details
  const subject = await populateSubject(
    Subject.findById(subjectId)
  );

  // Check if the subject was found
  if (!subject) {
    throw new ApiError(404, "Subject not found."); // Use 404 for not found
  }

  // Return success response with the subject data
  return res.status(200).json(new Apiresponse(200, subject, "Subject found successfully."));
});

// ⭐ Controller to update a subject record by ID
const updateSubject = asyncHandler(async (req, res) => { // Renamed function
  // Get the subject ID from the URL parameters
  const subjectId = req.params.id;

   // Validate that an ID was provided
  if (!subjectId) {
    throw new ApiError(400, "Subject ID not provided for update."); // Use 400
  }

  // Get updatable fields from request body
  const {
    subjectCode,
    subjectName,
    maxMarksTheory, // Corrected field name
    maxMarksPractical, // Corrected field name
    subCredit,
    subjectTeacher, // Assuming subjectsTeacher array can be updated
  } = req.body;

   // Basic validation: Check if at least one field is provided for update
   if (!(subjectCode || subjectName || maxMarksTheory !== undefined || maxMarksPractical !== undefined || subCredit !== undefined || subjectTeacher !== undefined)) {
       throw new ApiError(400, "No valid fields provided for update.");
   }


  // Optional: Add more specific validation for each field if it's provided in the body
   if (maxMarksTheory !== undefined && (typeof maxMarksTheory !== 'number' || maxMarksTheory < 0)) {
       throw new ApiError(400, "Invalid value for theory marks.");
   }
    if (maxMarksPractical !== undefined && (typeof maxMarksPractical !== 'number' || maxMarksPractical < 0)) {
       throw new ApiError(400, "Invalid value for practical marks.");
   }
     if (subCredit !== undefined && (typeof subCredit !== 'number' || subCredit < 0)) {
       throw new ApiError(400, "Invalid value for subject credit.");
   }

   // Validate subjectTeacher if provided
  if (subjectTeacher !== undefined && !Array.isArray(subjectTeacher)) {
      throw new ApiError(400, "Subject teachers must be provided as an array if updating.");
  }
   // Further validation: check if teacher IDs are valid ObjectIds if needed


  // Find the subject by ID and update it
  const updatedSubject = await Subject.findByIdAndUpdate(
    subjectId, // Find by ID from params
    {
      $set: { // Use $set to update specific fields
         // Conditionally include fields if they are provided in the body, applying trimming/casing
        ...(subjectCode && { subjectCode: subjectCode.trim().toUpperCase() }),
        ...(subjectName && { subjectName: subjectName.trim() }),
        ...(maxMarksTheory !== undefined && { maxMarksTheory }), // Include 0 value if provided
        ...(maxMarksPractical !== undefined && { maxMarksPractical }), // Include 0 value if provided
        ...(subCredit !== undefined && { subCredit }), // Include 0 value if provided
        ...(subjectTeacher !== undefined && { subjectTeacher: subjectTeacher || [] }), // Update array, default to empty if null/undefined
      },
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators (important for unique, min, max)
    }
  ).populate("subjectTeacher", "fullName teacherId"); // Populate teacher details in the returned document

  // Check if the subject was found and updated
  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found for update."); // Use 404
  }

  // Return success response with the updated subject data
  return res
    .status(200) // Use 200 OK for successful update
    .json(new Apiresponse(200, updatedSubject, "Subject updated successfully."));
});

// Export all relevant controller functions
export { addSubject, getAllSubjects, getSubjectById, updateSubject }; // Corrected names