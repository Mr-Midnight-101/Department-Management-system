import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Student } from "../models/student.model.js";
import dayjs from "dayjs";
import { capitalize } from "../utils/capitalize.js";

// Helper function to populate the currentCourse field
const populateStudent = (query) => {
  return query.populate("currentCourse", "courseName");
};

// Controller to add a new student
const addStudent = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      enrollmentNo,
      rollNo,
      email,
      contactInfo,
      fatherName,
      fullAdd,
      category,
      currentCourse,
      studentType,
      admissionYear,
    } = req.body;

    const requiredFields = [
      fullName,
      enrollmentNo,
      rollNo,
      email,
      contactInfo,
      fatherName,
      category,
      studentType,
      admissionYear,
    ];

    if (requiredFields.some((field) => field?.trim() == "" || field == null)) {
      throw new ApiError(400, `All required fields must be filled.`);
    }
    console.log("this is from frontend dateof birth", dateOfBirth);

    const dob = dateOfBirth;
    if (!dayjs(dob).isValid()) {
      throw new ApiError(400, "Invalid date format for date of birth.");
    }
    console.log("date of birth inside controller , using dayjs", dob);
    const existStudent = await Student.aggregate([
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ["$enrollmentNo", enrollmentNo.trim().toUpperCase()] },
              { $eq: ["$rollNo", rollNo.trim().toUpperCase()] },
              { $eq: ["$email", email.trim().toLowerCase()] },
              { $eq: ["$contactInfo", contactInfo.trim()] },
            ],
          },
        },
      },
    ]);

    if (existStudent.length > 0) {
      const match = existStudent[0];
      let errorMessage = "A student with these details already exists.";

      if (match.enrollmentNo === enrollmentNo.toUpperCase()) {
        errorMessage = `Student with Enrollment Number '${enrollmentNo
          .trim()
          .toUpperCase()}' already exists.`;
      } else if (match.rollNo === rollNo.toUpperCase()) {
        errorMessage = `Student with Roll Number '${rollNo
          .trim()
          .toUpperCase()}' already exists.`;
      } else if (match.email === email.toLowerCase()) {
        errorMessage = `Student with Email '${email
          .trim()
          .toLowerCase()}' already exists.`;
      } else if (match.contactInfo === contactInfo.trim()) {
        errorMessage = `Student with Contact Info '${contactInfo.trim()}' already exists.`;
      }

      throw new ApiError(409, errorMessage);
    }
    console.log("this is dayjs function before new student object", dayjs(dob));

    console.log("after converting date by dayjs", dob);

    const createdStudent = await Student.create({
      fullName: capitalize(fullName.trim()),
      dateOfBirth: dob,
      enrollmentNo: enrollmentNo.trim().toUpperCase(),
      rollNo: rollNo.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      contactInfo: contactInfo.trim(),
      fatherName: capitalize(fatherName.trim()),
      fullAdd: {
        street: fullAdd?.street?.trim() || "",
        city: capitalize(fullAdd?.city?.trim()) || "",
        state: capitalize(fullAdd?.state?.trim()) || "",
        postalCode: fullAdd?.postalCode?.trim() || "",
        country: fullAdd?.country?.trim().toUpperCase() || "INDIA",
      },
      category: category.trim().toUpperCase(),
      currentCourse: currentCourse || null,
      studentType: studentType,
      admissionYear: admissionYear || "",
    });

    const student = await Student.aggregate([
      { $match: { _id: createdStudent._id } },
      {
        $lookup: {
          from: "courses",
          localField: "currentCourse",
          foreignField: "_id",
          as: "currentCourse",
        },
      },
      {
        $unwind: {
          path: "$currentCourse",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

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
  } catch (error) {
    console.log(error, "");
  }
});

// Controller to get all students
const getAllStudents = asyncHandler(async (req, res) => {
  const filter = {};
  const allStudents = await populateStudent(Student.find(filter));

  return res
    .status(200)
    .json(
      new Apiresponse(200, allStudents, "Student records fetched successfully.")
    );
});

// Controller to get a student by ID
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

// Controller to update student details
const updateStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  if (!studentId) {
    throw new ApiError(400, "Student ID not provided for update.");
  }

  const {
    fullName,
    dateOfBirth,
    enrollmentNo,
    rollNo,
    email,
    contactInfo,
    fatherName,
    fullAdd,
    category,
    currentCourse,
    studentType,
    admissionYear,
  } = req.body;

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
      currentCourse ||
      studentType ||
      admissionYear
    )
  ) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  if (dateOfBirth !== undefined && !dayjs(dateOfBirth).isValid()) {
    throw new ApiError(400, "Invalid date of birth format.");
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

  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        ...(fullName?.trim() && { fullName: capitalize(fullName.trim()) }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(enrollmentNo?.trim() && {
          enrollmentNo: enrollmentNo.trim().toUpperCase(),
        }),
        ...(rollNo?.trim() && { rollNo: rollNo.trim().toUpperCase() }),
        ...(email?.trim() && { email: email.trim().toLowerCase() }),
        ...(contactInfo?.trim() && { contactInfo: contactInfo.trim() }),
        ...(fatherName?.trim() && {
          fatherName: capitalize(fatherName.trim()),
        }),
        ...(fullAdd && {
          fullAdd: {
            street: fullAdd.street?.trim().toLowerCase() || "",
            city: capitalize(fullAdd.city?.trim()) || "",
            state: capitalize(fullAdd.state?.trim()) || "",
            postalCode: fullAdd.postalCode?.trim() || "",
            country: fullAdd.country?.trim().toUpperCase() || "INDIA",
          },
        }),
        ...(category?.trim() && { category }),
        ...((currentCourse && { currentCourse }) || ""),
        ...(admissionYear !== undefined && { admissionYear }),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "currentCourse",
    select: " courseName",
    options: {
      sort: { courseName: 1 },
    },
  });

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

// Controller to count total students
const studentCount = asyncHandler(async (req, res) => {
  try {
    const count = await Student.countDocuments();
    if (!count) throw new ApiError(400, "Failed to fetch student count.");
    return res
      .status(200)
      .json(new Apiresponse(200, count, "Student count fetched successfully."));
  } catch (error) {
    console.error("Failed to fetch student count.", error);
  }
});

export {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  studentCount,
};
