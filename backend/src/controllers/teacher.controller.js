import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Apiresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
import { capitalize } from "../utils/capitalize.js";

const generateAccessAndRefreshTokens = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher)
    throw new ApiError(404, "Teacher not found during token generation.");
  const accessToken = teacher.generateAccessToken();
  const refreshToken = teacher.generateRefreshToken();
  teacher.teacherRefreshToken = refreshToken;
  await teacher.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerTeacher = asyncHandler(async (req, res) => {
  let {
    teacherFullName,
    teacherEmail,
    teacherUsername,
    teacherPassword,
    teacherId,
    teacherAvatar,
    teacherAssignedSubjects,
    teacherContactInfo,
  } = req.body;

  if (
    [
      teacherFullName,
      teacherUsername,
      teacherEmail,
      teacherPassword,
      teacherId,
      teacherContactInfo,
    ].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "One or more required fields cannot be empty.");
  }

  const existedTeacher = await Teacher.findOne({
    $or: [
      { teacherUsername },
      { teacherEmail },
      { teacherId },
      { teacherContactInfo },
    ],
  });

  if (existedTeacher) {
    let errorMessage = "Teacher already exists.";
    if (existedTeacher.teacherUsername === teacherUsername.toLowerCase())
      errorMessage = "Username already taken.";
    else if (existedTeacher.teacherEmail === teacherEmail.toLowerCase())
      errorMessage = "Email already registered.";
    else if (existedTeacher.teacherId === teacherId)
      errorMessage = "Teacher ID already registered.";
    else if (existedTeacher.teacherContactInfo === teacherContactInfo)
      errorMessage = "Contact info already registered.";
    throw new ApiError(409, errorMessage);
  }

  const avatarLocalpath = req.file?.path;
  let avatarImage = { url: "" };
  if (avatarLocalpath) {
    avatarImage = await uploadOnCloudinary(avatarLocalpath);
  }

  teacherFullName = capitalize(teacherFullName);

  const teacher = await Teacher.create({
    teacherFullName: teacherFullName.trim().toLowerCase(),
    teacherEmail: teacherEmail.trim().toLowerCase(),
    teacherUsername: teacherUsername.trim().toLowerCase(),
    teacherPassword,
    teacherId: teacherId.trim(),
    teacherAvatar: avatarImage?.url || "",
    teacherContactInfo: teacherContactInfo.trim(),
    teacherAssignedSubjects: teacherAssignedSubjects || [],
  });

  const createdTeacher = await Teacher.findById(teacher._id)
    .select("-teacherPassword -teacherRefreshToken")
    .populate({
      path: "teacherAssignedSubjects",
      select: "subjectName",
      options: { sort: "subjectName" },
    });

  if (!createdTeacher) {
    throw new ApiError(
      500,
      "Something went wrong while registering the teacher."
    );
  }

  return res
    .status(201)
    .json(
      new Apiresponse(201, createdTeacher, "Teacher registered successfully.")
    );
});

const loginTeacher = asyncHandler(async (req, res) => {
  const { teacherUsername, teacherEmail, teacherPassword } = req.body;

  if ((!teacherUsername && !teacherEmail) || !teacherPassword) {
    throw new ApiError(
      400,
      "Please provide either username or email and the password."
    );
  }

  const teacher = await Teacher.findOne({
    $or: [{ teacherUsername }, { teacherEmail }],
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  const isPasswordCorrect = await teacher.isPasswordCorrect(teacherPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    teacher._id
  );

  const loggedInTeacher = await Teacher.findById(teacher._id).select(
    "-teacherPassword -teacherRefreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Apiresponse(200, loggedInTeacher, "Teacher logged in successfully.")
    );
});

const logoutTeacher = asyncHandler(async (req, res) => {
  await Teacher.findByIdAndUpdate(
    req.teacher._id,
    { $unset: { teacherRefreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200, {}, "Teacher logged out successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Unauthorized request. Refresh token not provided."
    );
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid or expired refresh token. Please log in again."
    );
  }

  const teacher = await Teacher.findById(decodedToken?._id);

  if (!teacher) {
    throw new ApiError(401, "Unauthorized request. Invalid refresh token.");
  }

  if (incomingRefreshToken !== teacher.teacherRefreshToken) {
    throw new ApiError(
      401,
      "Refresh token is expired or invalid. Please log in again."
    );
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(teacher._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new Apiresponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully."
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Please provide both old and new passwords.");
  }

  const teacher = await Teacher.findById(req.teacher._id, {
    new: true,
    runValidators: true,
  }).select("+teacherPassword");

  const isPasswordCorrect = await teacher.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password.");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password."
    );
  }

  teacher.teacherPassword = newPassword;
  await teacher.save();

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Password updated successfully."));
});

const getCurrentTeacher = asyncHandler(async (req, res) => {
  if (!req.teacher) {
    throw new ApiError(401, "Teacher not authenticated.");
  }
  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        req.teacher,
        "Current teacher details fetched successfully."
      )
    );
});

const updateTeacherDetails = asyncHandler(async (req, res) => {
  let {
    teacherFullName,
    teacherEmail,
    teacherUsername,
    teacherId,
    teacherContactInfo,
  } = req.body;

  if (
    !(
      teacherFullName ||
      teacherEmail ||
      teacherUsername ||
      teacherId ||
      teacherContactInfo
    )
  ) {
    throw new ApiError(400, "Please provide at least one field to update.");
  }

  if (teacherFullName) teacherFullName = capitalize(teacherFullName);

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      $set: {
        ...(teacherFullName && {
          teacherFullName: teacherFullName.trim().toLowerCase(),
        }),
        ...(teacherEmail && {
          teacherEmail: teacherEmail.trim().toLowerCase(),
        }),
        ...(teacherUsername && {
          teacherUsername: teacherUsername.trim().toLowerCase(),
        }),
        ...(teacherId && { teacherId: teacherId.trim() }),
        ...(teacherContactInfo && {
          teacherContactInfo: teacherContactInfo.trim(),
        }),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-teacherPassword -teacherRefreshToken")
    .populate({
      path: "teacherAssignedSubjects",
      select: "subjectName",
      options: { sort: "subjectName" },
    });

  if (!updatedTeacher) {
    throw new ApiError(404, "Teacher not found for update.");
  }

  res
    .status(200)
    .json(
      new Apiresponse(
        200,
        updatedTeacher,
        "Teacher details updated successfully."
      )
    );
});

const updateTeacherAvatar = asyncHandler(async (req, res) => {
  const avatarLocalpath = req.file?.path;

  if (!avatarLocalpath) {
    throw new ApiError(400, "Avatar file is missing. Please upload a file.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);

  if (!avatar || !avatar.url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    { $set: { teacherAvatar: avatar.url } },
    { new: true }
  ).select("-teacherPassword -teacherRefreshToken");

  if (!updatedTeacher) {
    throw new ApiError(500, "Failed to update teacher avatar in the database.");
  }

  res
    .status(200)
    .json(
      new Apiresponse(
        200,
        updatedTeacher,
        "Teacher avatar updated successfully."
      )
    );
});

const getTeacherById = asyncHandler(async (req, res) => {
  const teacherId = req.params.teacherId;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required.");
  }

  const teacher = await Teacher.findById(teacherId)
    .select("-teacherPassword -teacherRefreshToken")
    .populate({
      path: "teacherAssignedSubjects",
      select: "subjectName",
      options: { sort: "subjectName" },
    });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  res
    .status(200)
    .json(new Apiresponse(200, teacher, "Teacher fetched successfully."));
});

const getAllTeachers = asyncHandler(async (req, res) => {
  const teacherList = await Teacher.find({})
    .select("-teacherPassword -teacherRefreshToken")
    .populate({
      path: "teacherAssignedSubjects",
      select: "subjectName",
      options: { sort: "subjectName" },
    });

  if (teacherList.length === 0) {
    throw new ApiError(404, "No teachers found");
  }

  return res
    .status(200)
    .json(new Apiresponse(200, teacherList, "Teachers fetched successfully"));
});

const teacherCount = asyncHandler(async (req, res) => {
  const count = await Teacher.countDocuments();
  res
    .status(200)
    .json(new Apiresponse(200, count, "Teacher count fetched successfully."));
});

export {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  changePassword,
  getCurrentTeacher,
  updateTeacherDetails,
  updateTeacherAvatar,
  getTeacherById,
  getAllTeachers,
  teacherCount,
};
