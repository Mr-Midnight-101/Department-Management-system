// src/controllers/grade.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Grade } from "../models/grade.model.js";
// Might need Subject model to get credit point if not provided in body
// import { Subject } from "../models/subject.model.js";

// ⭐ Helper function to populate grade details
const populateGrade = (query) => {
  return query
    .populate("student", "fullName enrollmentNo rollNo") // Populate student details
    .populate("subject", "subjectName subjectCode subCredit") // Populate subject details including credit
    .populate("course", "courseName courseCode"); // Populate course details
};

// ⭐ Controller to add a new grade record
const addGrade = asyncHandler(async (req, res) => {
  // Extract necessary fields from the request body
  const {
    student,
    subject,
    course,
    examYear,
    examMonth,
    obtMarksPractical,
    obtMarksTheory,
    gradeLetter,
    gradePoint,
    creditPoint, // Assuming creditPoint is provided in the body for simplicity
    // totalCreditPoint, totalCreditValid, securedValidCredit, CVV are often calculated
    totalCreditValid, // Assuming these might also be provided or calculated
    securedValidCredit,
    CVV,
  } = req.body;

  // Validate required fields
  // Assuming totalCreditPoint, totalCreditValid, securedValidCredit, CVV might be calculated later or are optional in body
  if (
    [
      student,
      subject,
      course,
      examYear,
      examMonth,
      obtMarksPractical,
      obtMarksTheory,
      gradeLetter,
      gradePoint,
      creditPoint,
    ].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
     const missingField = [
        student, subject, course, examYear, examMonth,
        obtMarksPractical, obtMarksTheory, gradeLetter, gradePoint, creditPoint
     ].find(
         (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    );
    throw new ApiError(400, `${missingField || "One or more required fields"} cannot be empty.`);
  }

  // Validate number fields
  if (typeof examYear !== 'number' || examYear < 1900 || examYear > new Date().getFullYear() + 5) {
       throw new ApiError(400, "Invalid exam year.");
  }
  if (typeof obtMarksPractical !== 'number' || obtMarksPractical < 0) {
       throw new ApiError(400, "Invalid practical marks.");
  }
   if (typeof obtMarksTheory !== 'number' || obtMarksTheory < 0) {
       throw new ApiError(400, "Invalid theory marks.");
  }
   if (typeof gradePoint !== 'number' || gradePoint < 0) {
       throw new ApiError(400, "Invalid grade point.");
  }
   if (typeof creditPoint !== 'number' || creditPoint < 0) {
       throw new ApiError(400, "Invalid credit point.");
  }
   // Validate letter grade format if needed (e.g., regex)

   // --- Calculate derived fields ---
   const totalMarks = obtMarksPractical + obtMarksTheory;
   const totalCreditPoint = gradePoint * creditPoint;

   // Assuming totalCreditValid, securedValidCredit, CVV are provided or need specific calculation logic
   // If they are *always* derived, calculate them here based on defined rules.
   // If they are provided in body, add validation. For now, assume they are provided or optional.

  // Check if a grade for this student, subject, and exam period already exists (using the compound index)
   const existedGrade = await Grade.findOne({
        student: student,
        subject: subject,
        examYear: examYear,
        examMonth: examMonth.trim().toLowerCase(), // Ensure match with stored format
    });

  if (existedGrade) {
    throw new ApiError(
      409, // Use 409 Conflict
      `Grade for student ${student} in subject ${subject} for ${examMonth} ${examYear} already exists.`
    );
  }

  // Create the new grade document
  const grade = await Grade.create({
    student,
    subject,
    course,
    examYear,
    examMonth: examMonth.trim().toLowerCase(), // Store month in lowercase
    obtMarksPractical,
    obtMarksTheory,
    totalMarks, // Include calculated total marks
    gradeLetter: gradeLetter.trim().toUpperCase(), // Store letter in uppercase
    gradePoint,
    creditPoint,
    totalCreditPoint, // Include calculated total credit points
    totalCreditValid: totalCreditValid !== undefined ? totalCreditValid : 0, // Include if provided, default otherwise
    securedValidCredit: securedValidCredit !== undefined ? securedValidCredit : 0, // Include if provided, default otherwise
    CVV: CVV !== undefined ? CVV : 0, // Include if provided, default otherwise
  });

  // Fetch the created grade record with populated details
  const createdGrade = await populateGrade(Grade.findById(grade._id));

  // Check if the grade record was successfully created and fetched
  if (!createdGrade) {
    throw new ApiError(500, "Something went wrong while saving the grade record.");
  }

  // Return a success response with the created grade data
  return res
    .status(201) // Use 201 Created
    .json(new Apiresponse(201, createdGrade, "Grade added successfully."));
});

// ⭐ Controller to get all grade records
const getAllGrades = asyncHandler(async (req, res) => {
  // Implement fetching all grade records
  // Can add filtering (by student, subject, course, year, month), sorting, and pagination

  const filter = {}; // Start with an empty filter
  // Example filtering from query parameters:
  // if (req.query.studentId) filter.student = req.query.studentId;
  // if (req.query.subjectId) filter.subject = req.query.subjectId;
  // if (req.query.examYear) filter.examYear = parseInt(req.query.examYear);
  // if (req.query.examMonth) filter.examMonth = req.query.examMonth.trim().toLowerCase();


  const allGrades = await populateGrade(Grade.find(filter)); // Fetch all (or filtered) and populate

  if (!allGrades || allGrades.length === 0) {
    // Return 200 with empty array if no grades are found
    return res
      .status(200)
      .json(new Apiresponse(200, [], "No grade records found."));
  }

  // Return success response with all grades
  return res
    .status(200)
    .json(new Apiresponse(200, allGrades, "Grade records fetched successfully."));
});

// ⭐ Controller to get a specific grade record by ID
const getGradeById = asyncHandler(async (req, res) => {
  // Get the grade ID from the URL parameters
  const gradeId = req.params.id;

  // Validate that an ID was provided
  if (!gradeId) {
    throw new ApiError(400, "Grade ID not provided."); // Use 400
  }

  // Find the grade by ID and populate details
  const grade = await populateGrade(Grade.findById(gradeId));

  // Check if the grade record was found
  if (!grade) {
    throw new ApiError(404, "Grade record not found."); // Use 404
  }

  // Return success response with the grade data
  return res.status(200).json(new Apiresponse(200, grade, "Grade record found successfully."));
});

// ⭐ Controller to update a grade record by ID
// You would implement update logic similarly to other update controllers
/*
const updateGrade = asyncHandler(async (req, res) => {
    const gradeId = req.params.id;
    if (!gradeId) {
        throw new ApiError(400, "Grade ID not provided for update.");
    }

    const {
        examYear, examMonth, obtMarksPractical, obtMarksTheory,
        gradeLetter, gradePoint, creditPoint, totalCreditValid,
        securedValidCredit, CVV
        // Note: student, subject, course typically should NOT be changed in an update
    } = req.body;

    // Basic validation for fields if provided
    // ... validation checks ...

    // Calculate derived fields if necessary
    let updateFields = { $set: {} };
    if (examYear !== undefined) updateFields.$set.examYear = examYear;
    if (examMonth !== undefined) updateFields.$set.examMonth = examMonth.trim().toLowerCase();
    if (obtMarksPractical !== undefined) updateFields.$set.obtMarksPractical = obtMarksPractical;
    if (obtMarksTheory !== undefined) updateFields.$set.obtMarksTheory = obtMarksTheory;

    // Recalculate totalMarks if practical or theory marks are updated
    if (obtMarksPractical !== undefined || obtMarksTheory !== undefined) {
         // Need to fetch current grade to get the non-updated mark if only one is changing
         const currentGrade = await Grade.findById(gradeId);
         if (!currentGrade) throw new ApiError(404, "Grade not found for update calculation.");
         const updatedPractical = obtMarksPractical !== undefined ? obtMarksPractical : currentGrade.obtMarksPractical;
         const updatedTheory = obtMarksTheory !== undefined ? obtMarksTheory : currentGrade.obtMarksTheory;
         updateFields.$set.totalMarks = updatedPractical + updatedTheory;
    }

    if (gradeLetter !== undefined) updateFields.$set.gradeLetter = gradeLetter.trim().toUpperCase();
    if (gradePoint !== undefined) updateFields.$set.gradePoint = gradePoint;
    if (creditPoint !== undefined) updateFields.$set.creditPoint = creditPoint; // Be careful changing creditPoint

    // Recalculate totalCreditPoint if gradePoint or creditPoint are updated
    if (gradePoint !== undefined || creditPoint !== undefined) {
         const currentGrade = await Grade.findById(gradeId);
         if (!currentGrade) throw new ApiError(404, "Grade not found for update calculation.");
          const updatedGradePoint = gradePoint !== undefined ? gradePoint : currentGrade.gradePoint;
         const updatedCreditPoint = creditPoint !== undefined ? creditPoint : currentGrade.creditPoint;
         updateFields.$set.totalCreditPoint = updatedGradePoint * updatedCreditPoint;
    }


    if (totalCreditValid !== undefined) updateFields.$set.totalCreditValid = totalCreditValid;
    if (securedValidCredit !== undefined) updateFields.$set.securedValidCredit = securedValidCredit;
    if (CVV !== undefined) updateFields.$set.CVV = CVV;

    // If $set is empty, no fields were provided for update
     if (Object.keys(updateFields.$set).length === 0) {
        throw new ApiError(400, "No valid fields provided for update.");
     }

    const updatedGrade = await Grade.findByIdAndUpdate(
        gradeId,
        updateFields,
        { new: true, runValidators: true }
    ).populate("student", "fullName").populate("subject", "subjectName").populate("course", "courseName"); // Populate updated doc

    if (!updatedGrade) {
        throw new ApiError(404, "Grade record not found for update.");
    }

    return res.status(200).json(new Apiresponse(200, updatedGrade, "Grade updated successfully."));
});
*/


export { addGrade, getAllGrades, getGradeById }; // Export implemented functions