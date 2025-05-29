// src/controllers/subject.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Subject } from "../models/subject.model.js";
import mongoose from "mongoose";
import { capitalize } from "../utils/capitalize.js";

// Add a new subject
const addSubject = asyncHandler(async (req, res) => {
  let {
    subjectCode,
    subjectName,
    maxMarksTheory,
    maxMarksPractical,
    subCredit,
    subjectTeacher,
  } = req.body;

  if (
    [
      subjectCode,
      subjectName,
      maxMarksTheory,
      maxMarksPractical,
      subCredit,
    ].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "One or more required fields are missing.");
  }

  if (typeof maxMarksTheory !== "number" || maxMarksTheory < 0) {
    throw new ApiError(400, "Invalid value for theory marks.");
  }
  if (typeof maxMarksPractical !== "number" || maxMarksPractical < 0) {
    throw new ApiError(400, "Invalid value for practical marks.");
  }
  if (typeof subCredit !== "number" || subCredit < 0) {
    throw new ApiError(400, "Invalid value for subject credit.");
  }

  if (subjectTeacher !== undefined && !Array.isArray(subjectTeacher)) {
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
    maxMarksTheory,
    maxMarksPractical,
    subCredit,
    subjectTeacher: subjectTeacher || [],
  });

  const createdSubject = await Subject.aggregate([
    { $match: { _id: subject._id } },
    {
      $lookup: {
        from: "teachers",
        localField: "subjectTeacher",
        foreignField: "_id",
        as: "subjectTeacher",
      },
    },
    { $unwind: { path: "$subjectTeacher", preserveNullAndEmptyArrays: true } },
  ]);

  if (!createdSubject) {
    throw new ApiError(500, "Something went wrong while adding the subject.");
  }

  return res
    .status(201)
    .json(new Apiresponse(201, createdSubject, "Subject added successfully."));
});

// Get all subjects
const getAllSubjects = asyncHandler(async (req, res) => {
  const allSubjects = await Subject.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "subjectTeacher",
        foreignField: "_id",
        as: "subjectTeacher",
      },
    },
    { $unwind: { path: "$subjectTeacher", preserveNullAndEmptyArrays: true } },
  ]);

  if (!allSubjects || allSubjects.length === 0) {
    return res.status(200).json(new Apiresponse(200, [], "No subjects found."));
  }

  return res
    .status(200)
    .json(new Apiresponse(200, allSubjects, "Subjects fetched successfully."));
});

// Update subject by ID
const updateSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;

  if (!subjectId) {
    throw new ApiError(400, "Subject ID not provided for update.");
  }

  let {
    subjectCode,
    subjectName,
    maxMarksTheory,
    maxMarksPractical,
    subCredit,
    subjectTeacher,
  } = req.body;

  if (
    !(
      subjectCode ||
      subjectName ||
      maxMarksTheory !== undefined ||
      maxMarksPractical !== undefined ||
      subCredit !== undefined ||
      subjectTeacher !== undefined
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  if (
    maxMarksTheory !== undefined &&
    (typeof maxMarksTheory !== "number" || maxMarksTheory < 0)
  ) {
    throw new ApiError(400, "Invalid value for theory marks.");
  }
  if (
    maxMarksPractical !== undefined &&
    (typeof maxMarksPractical !== "number" || maxMarksPractical < 0)
  ) {
    throw new ApiError(400, "Invalid value for practical marks.");
  }
  if (
    subCredit !== undefined &&
    (typeof subCredit !== "number" || subCredit < 0)
  ) {
    throw new ApiError(400, "Invalid value for subject credit.");
  }
  if (subjectTeacher !== undefined && !Array.isArray(subjectTeacher)) {
    throw new ApiError(400, "Subject teachers must be an array.");
  }

  if (subjectCode) subjectCode = subjectCode.trim().toUpperCase();
  if (subjectName) subjectName = capitalize(subjectName.trim());

  const updatedSubject = await Subject.findByIdAndUpdate(
    subjectId,
    {
      $set: {
        ...(subjectCode && { subjectCode }),
        ...(subjectName && { subjectName }),
        ...(maxMarksTheory !== undefined && { maxMarksTheory }),
        ...(maxMarksPractical !== undefined && { maxMarksPractical }),
        ...(subCredit !== undefined && { subCredit }),
        ...(subjectTeacher !== undefined && {
          subjectTeacher: subjectTeacher || [],
        }),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "subjectTeacher",
    select: "fullName teacherId",
    options: {
      sort: "fullName",
    },
  });

  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found for update.");
  }

  return res
    .status(200)
    .json(
      new Apiresponse(200, updatedSubject, "Subject updated successfully.")
    );
});

export { addSubject, getAllSubjects, updateSubject };
