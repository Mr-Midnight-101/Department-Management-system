// src/controllers/subject.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Subject } from "../models/subject.model.js";
import { capitalize } from "../utils/capitalize.js";

const populateSubject = (query) => {
  return query.populate({ path: "subjectTeachers", select: "teacherFullName _id" });
};

const addSubject = asyncHandler(async (req, res) => {
  let {
    subjectCode,
    subjectName,
    subjectMaxMarksTheory,
    subjectMaxMarksPractical,
    subjectCreditPoints,
    subjectTeachers,
  } = req.body;

  if (
    [
      subjectCode,
      subjectName,
      subjectMaxMarksTheory,
      subjectMaxMarksPractical,
      subjectCreditPoints,
    ].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "One or more required fields are missing.");
  }

  if (typeof subjectMaxMarksTheory !== "number" || subjectMaxMarksTheory < 0) {
    throw new ApiError(400, "Invalid value for theory marks.");
  }
  if (typeof subjectMaxMarksPractical !== "number" || subjectMaxMarksPractical < 0) {
    throw new ApiError(400, "Invalid value for practical marks.");
  }
  if (typeof subjectCreditPoints !== "number" || subjectCreditPoints < 0) {
    throw new ApiError(400, "Invalid value for subject credit points.");
  }
//todo add teachers as well in future..⭐
  if (subjectTeachers !== undefined && !Array.isArray(subjectTeachers)) {
    throw new ApiError(400, "Subject teachers must be provided as an array.");
  }

  subjectCode = subjectCode.trim().toUpperCase();
  subjectName = capitalize(subjectName.trim());

  const existedSubject = await Subject.findOne({
    $or: [{ subjectCode }, { subjectName }],
  });

  if (existedSubject) {
    const errorMessage =
      existedSubject.subjectCode === subjectCode
        ? `Subject with code '${subjectCode}' already exists.`
        : `Subject with name '${subjectName}' already exists.`;
    throw new ApiError(409, errorMessage);
  }

  const subject = await Subject.create({
    subjectCode,
    subjectName,
    subjectMaxMarksTheory,
    subjectMaxMarksPractical,
    subjectCreditPoints,
    subjectTeachers: subjectTeachers || [],
  });

  const createdSubject = await populateSubject(Subject.findById(subject._id));

  if (!createdSubject) {
    throw new ApiError(500, "Something went wrong while adding the subject.");
  }

  return res
    .status(201)
    .json(new Apiresponse(201, createdSubject, "Subject added successfully."));
});

const getAllSubjects = asyncHandler(async (req, res) => {
  const allSubjects = await populateSubject(Subject.find({}));
  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        allSubjects,
        allSubjects.length === 0
          ? "No subjects found."
          : "Subjects fetched successfully."
      )
    );
});

const updateSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  if (!subjectId) {
    throw new ApiError(400, "Subject ID not provided for update.");
  }

  let {
    subjectCode,
    subjectName,
    subjectMaxMarksTheory,
    subjectMaxMarksPractical,
    subjectCreditPoints,
    subjectTeachers,
  } = req.body;

  if (
    !(
      subjectCode ||
      subjectName ||
      subjectMaxMarksTheory !== undefined ||
      subjectMaxMarksPractical !== undefined ||
      subjectCreditPoints !== undefined ||
      subjectTeachers !== undefined
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  if (
    subjectMaxMarksTheory !== undefined &&
    (typeof subjectMaxMarksTheory !== "number" || subjectMaxMarksTheory < 0)
  ) {
    throw new ApiError(400, "Invalid value for theory marks.");
  }
  if (
    subjectMaxMarksPractical !== undefined &&
    (typeof subjectMaxMarksPractical !== "number" || subjectMaxMarksPractical < 0)
  ) {
    throw new ApiError(400, "Invalid value for practical marks.");
  }
  if (
    subjectCreditPoints !== undefined &&
    (typeof subjectCreditPoints !== "number" || subjectCreditPoints < 0)
  ) {
    throw new ApiError(400, "Invalid value for subject credit points.");
  }
  if (subjectTeachers !== undefined && !Array.isArray(subjectTeachers)) {
    throw new ApiError(400, "Subject teachers must be an array.");
  }

  if (subjectCode) subjectCode = subjectCode.trim().toUpperCase();
  if (subjectName) subjectName = capitalize(subjectName.trim());

  const updatedSubject = await populateSubject(
    Subject.findByIdAndUpdate(
      subjectId,
      {
        $set: {
          ...(subjectCode && { subjectCode }),
          ...(subjectName && { subjectName }),
          ...(subjectMaxMarksTheory !== undefined && { subjectMaxMarksTheory }),
          ...(subjectMaxMarksPractical !== undefined && { subjectMaxMarksPractical }),
          ...(subjectCreditPoints !== undefined && { subjectCreditPoints }),
          ...(subjectTeachers !== undefined && {
            subjectTeachers: subjectTeachers || [],
          }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
  );

  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found for update.");
  }

  return res
    .status(200)
    .json(
      new Apiresponse(200, updatedSubject, "Subject updated successfully.")
    );
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  if (!subjectId) {
    throw new ApiError(400, "Subject ID not provided for deletion.");
  }
  const deletedSubject = await populateSubject(
    Subject.findByIdAndDelete(subjectId)
  );
  if (!deletedSubject) {
    throw new ApiError(404, "Subject not found for deletion.");
  }
  return res
    .status(200)
    .json(
      new Apiresponse(200, deletedSubject, "Subject deleted successfully.")
    );
});

const subjectCount = asyncHandler(async (req, res) => {
  const count = await Subject.countDocuments();
  return res
    .status(200)
    .json(new Apiresponse(200, count, "Subject count fetched successfully."));
});

export { addSubject, getAllSubjects, updateSubject, deleteSubject, subjectCount };
