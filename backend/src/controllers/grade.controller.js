// src/controllers/grade.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Grade } from "../models/grade.model.js";

const populateGrade = (query) => {
  return query
    .populate({ path: "gradeStudent", select: "studentFullName _id" })
    .populate({ path: "gradeSubject", select: "subjectName _id" })
    .populate({ path: "gradeCourse", select: "courseTitle _id" });
};

const addGrade = asyncHandler(async (req, res) => {
  const {
    gradeStudent,
    gradeSubject,
    gradeCourse,
    gradeExamYear,
    gradeExamMonth,
    gradeObtainedPractical,
    gradeObtainedTheory,
    gradeLetter,
    gradePoint,
    gradeCreditPoint,
    gradeTotalCreditValid,
    gradeSecuredValidCredit,
    gradeCVV,
  } = req.body;

  if (
    [
      gradeStudent,
      gradeSubject,
      gradeCourse,
      gradeExamYear,
      gradeExamMonth,
      gradeObtainedPractical,
      gradeObtainedTheory,
      gradeLetter,
      gradePoint,
      gradeCreditPoint,
    ].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(
      400,
      "All required fields must be provided and cannot be empty."
    );
  }

  if (
    typeof gradeExamYear !== "number" ||
    gradeExamYear < 1900 ||
    gradeExamYear > new Date().getFullYear() + 5
  ) {
    throw new ApiError(400, "Invalid exam year.");
  }
  if (
    typeof gradeObtainedPractical !== "number" ||
    gradeObtainedPractical < 0
  ) {
    throw new ApiError(400, "Invalid practical marks.");
  }
  if (typeof gradeObtainedTheory !== "number" || gradeObtainedTheory < 0) {
    throw new ApiError(400, "Invalid theory marks.");
  }
  if (typeof gradePoint !== "number" || gradePoint < 0) {
    throw new ApiError(400, "Invalid grade point.");
  }
  if (typeof gradeCreditPoint !== "number" || gradeCreditPoint < 0) {
    throw new ApiError(400, "Invalid credit point.");
  }

  const gradeTotalMarks = gradeObtainedPractical + gradeObtainedTheory;
  const gradeTotalCreditPoints = gradePoint * gradeCreditPoint;

  const existedGrade = await Grade.findOne({
    gradeStudent,
    gradeSubject,
    gradeExamYear,
    gradeExamMonth: gradeExamMonth.trim().toLowerCase(),
  });

  if (existedGrade) {
    throw new ApiError(
      409,
      `Grade for student ${gradeStudent} in subject ${gradeSubject} for ${gradeExamMonth} ${gradeExamYear} already exists.`
    );
  }

  const grade = await Grade.create({
    gradeStudent,
    gradeSubject,
    gradeCourse,
    gradeExamYear,
    gradeExamMonth: gradeExamMonth.trim().toLowerCase(),
    gradeObtainedPractical,
    gradeObtainedTheory,
    gradeTotalMarks,
    gradeLetter: gradeLetter.trim().toUpperCase(),
    gradePoint,
    gradeCreditPoint,
    gradeTotalCreditPoints,
    gradeTotalCreditValid:
      gradeTotalCreditValid !== undefined ? gradeTotalCreditValid : 0,
    gradeSecuredValidCredit:
      gradeSecuredValidCredit !== undefined ? gradeSecuredValidCredit : 0,
    gradeCVV: gradeCVV !== undefined ? gradeCVV : 0,
  });

  const createdGrade = await populateGrade(Grade.findById(grade._id));

  if (!createdGrade) {
    throw new ApiError(
      500,
      "Something went wrong while saving the grade record."
    );
  }

  return res
    .status(201)
    .json(new Apiresponse(201, createdGrade, "Grade added successfully."));
});

const getAllGrades = asyncHandler(async (req, res) => {
  const allGrades = await populateGrade(Grade.find({}));
  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        allGrades,
        allGrades.length === 0
          ? "No grade records found."
          : "Grade records fetched successfully."
      )
    );
});

const getGradeById = asyncHandler(async (req, res) => {
  const gradeId = req.params.id;
  if (!gradeId) {
    throw new ApiError(400, "Grade ID not provided.");
  }
  const grade = await populateGrade(Grade.findById(gradeId));
  if (!grade) {
    throw new ApiError(404, "Grade record not found.");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, grade, "Grade record found successfully."));
});

const gradeCount = asyncHandler(async (req, res) => {
  const count = await Grade.countDocuments();
  return res
    .status(200)
    .json(new Apiresponse(200, count, "Grade count fetched successfully."));
});

const updateGrade = asyncHandler(async (req, res) => {
  const gradeId = req.params.id;
  const {
    gradeStudent,
    gradeSubject,
    gradeCourse,
    gradeExamYear,
    gradeExamMonth,
    gradeObtainedPractical,
    gradeObtainedTheory,
    gradeLetter,
    gradePoint,
    gradeCreditPoint,
    gradeTotalCreditValid,
    gradeSecuredValidCredit,
    gradeCVV,
  } = req.body;

  if (!gradeId) {
    throw new ApiError(400, "Grade ID not provided.");
  }

  if (
    !(
      gradeStudent ||
      gradeSubject ||
      gradeCourse ||
      gradeExamYear ||
      gradeExamMonth ||
      gradeObtainedPractical ||
      gradeObtainedTheory ||
      gradeLetter ||
      gradePoint ||
      gradeCreditPoint ||
      gradeTotalCreditValid ||
      gradeSecuredValidCredit ||
      gradeCVV
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  const updateData = {};
  if (gradeStudent) updateData.gradeStudent = gradeStudent;
  if (gradeSubject) updateData.gradeSubject = gradeSubject;
  if (gradeCourse) updateData.gradeCourse = gradeCourse;
  if (gradeExamYear) updateData.gradeExamYear = gradeExamYear;
  if (gradeExamMonth)
    updateData.gradeExamMonth = gradeExamMonth.trim().toLowerCase();
  if (gradeObtainedPractical !== undefined)
    updateData.gradeObtainedPractical = gradeObtainedPractical;
  if (gradeObtainedTheory !== undefined)
    updateData.gradeObtainedTheory = gradeObtainedTheory;
  if (gradeLetter) updateData.gradeLetter = gradeLetter.trim().toUpperCase();
  if (gradePoint !== undefined) updateData.gradePoint = gradePoint;
  if (gradeCreditPoint !== undefined)
    updateData.gradeCreditPoint = gradeCreditPoint;
  if (gradeTotalCreditValid !== undefined)
    updateData.gradeTotalCreditValid = gradeTotalCreditValid;
  if (gradeSecuredValidCredit !== undefined)
    updateData.gradeSecuredValidCredit = gradeSecuredValidCredit;
  if (gradeCVV !== undefined) updateData.gradeCVV = gradeCVV;

  // Recalculate totals if marks or points are updated
  if (
    updateData.gradeObtainedPractical !== undefined ||
    updateData.gradeObtainedTheory !== undefined
  ) {
    const practical =
      updateData.gradeObtainedPractical !== undefined
        ? updateData.gradeObtainedPractical
        : req.body.gradeObtainedPractical;
    const theory =
      updateData.gradeObtainedTheory !== undefined
        ? updateData.gradeObtainedTheory
        : req.body.gradeObtainedTheory;
    updateData.gradeTotalMarks = (practical || 0) + (theory || 0);
  }
  if (
    updateData.gradePoint !== undefined ||
    updateData.gradeCreditPoint !== undefined
  ) {
    const point =
      updateData.gradePoint !== undefined
        ? updateData.gradePoint
        : req.body.gradePoint;
    const credit =
      updateData.gradeCreditPoint !== undefined
        ? updateData.gradeCreditPoint
        : req.body.gradeCreditPoint;
    updateData.gradeTotalCreditPoints = (point || 0) * (credit || 0);
  }

  const updatedGrade = await Grade.findByIdAndUpdate(
    gradeId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedGrade) {
    throw new ApiError(404, "Grade record not found for update.");
  }

  const populatedGrade = await populateGrade(Grade.findById(updatedGrade._id));

  return res
    .status(200)
    .json(
      new Apiresponse(200, populatedGrade, "Grade record updated successfully.")
    );
});

export { addGrade, getAllGrades, getGradeById, gradeCount, updateGrade };
