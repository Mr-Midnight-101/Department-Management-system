import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assumed working utility
import Apiresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
import { capitalize } from "../utils/capitalize.js"; // Using your capitalize utility

// Helper to generate tokens
const generateAccessAndRefreshTokens = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, "Teacher not found during token generation.");
    }
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    teacher.refreshToken = refreshToken;
    await teacher.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
};

// Register a new teacher
const registerTeacher = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    username,
    password,
    teacherId,
    avatar,
    assignedSubjects,
    contactInfo,
  } = req.body;

  // Validate required fields
  if (
    [fullName, username, email, password, teacherId, contactInfo].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "One or more required fields cannot be empty.");
  }

  // Check if teacher already exists
  const existedTeacher = await Teacher.findOne({
    $or: [{ username }, { email }, { teacherId }],
  });

  if (existedTeacher) {
    let errorMessage = "Teacher already exists.";
    if (existedTeacher.username === username.toLowerCase())
      errorMessage = "Username already taken.";
    else if (existedTeacher.email === email.toLowerCase())
      errorMessage = "Email already registered.";
    else if (existedTeacher.teacherId === teacherId)
      errorMessage = "Teacher ID already registered.";

    throw new ApiError(409, errorMessage);
  }

  // Handle avatar upload if present
  const avatarLocalpath = req.file?.path;
  let avatarImage = { url: "" };

  if (avatarLocalpath) {
    try {
      avatarImage = await uploadOnCloudinary(avatarLocalpath);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
    }
  }

  fullName = capitalize(fullName);

  // Create teacher document
  const teacher = await Teacher.create({
    fullName: fullName.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    password,
    teacherId: teacherId.trim(),
    avatar: avatarImage?.url || "",
    contactInfo: contactInfo.trim(),
    assignedSubjects: assignedSubjects || [],
  });

  // Fetch created teacher without sensitive fields
  const createdTeacher = await Teacher.aggregate([
    { $match: { _id: teacher._id } },
    {
      $lookup: {
        from: "subjects",
        localField: "assignedSubjects",
        foreignField: "_id",
        as: "assignedSubjects",
      },
    },
    {
      $unwind: { path: "$assignedSubjects", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ]);

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

// Login a teacher
const loginTeacher = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    throw new ApiError(
      400,
      "Please provide either username or email and the password."
    );
  }

  const teacher = await Teacher.findOne({
    $or: [{ username }, { email }],
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  const isPasswordCorrect = await teacher.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    teacher._id
  );

  const loggedInTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
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

// Logout a teacher
const logoutTeacher = asyncHandler(async (req, res) => {
  await Teacher.findByIdAndUpdate(
    req.teacher._id,
    { $unset: { refreshToken: 1 } },
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

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Unauthorized request. Refresh token not provided."
    );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const teacher = await Teacher.findById(decodedToken?._id);

    if (!teacher) {
      throw new ApiError(401, "Unauthorized request. Invalid refresh token.");
    }

    if (incomingRefreshToken !== teacher.refreshToken) {
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
  } catch (error) {
    console.error("Error refreshing access token:", error);
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      throw new ApiError(
        401,
        "Invalid or expired refresh token. Please log in again."
      );
    }
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token."
    );
  }
});

// Change teacher's password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Please provide both old and new passwords.");
  }

  const teacher = await Teacher.findById(req.teacher._id).select("+password");

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

  teacher.password = newPassword;
  await teacher.save();

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Password updated successfully."));
});

// Get authenticated teacher details
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

// Update teacher details (non-sensitive)
const updateTeacherDetails = asyncHandler(async (req, res) => {
  let { fullName, email, username, teacherId, contactInfo } = req.body;

  if (!(fullName || email || username || teacherId || contactInfo)) {
    throw new ApiError(400, "Please provide at least one field to update.");
  }

  if (fullName) fullName = capitalize(fullName);

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      $set: {
        ...(fullName && { fullName: fullName.trim().toLowerCase() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(username && { username: username.trim().toLowerCase() }),
        ...(teacherId && { teacherId: teacherId.trim() }),
        ...(contactInfo && { contactInfo: contactInfo.trim() }),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-password -refreshToken")
    .populate();

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

// Update teacher avatar
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
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password -refreshToken");

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

// Get teacher by ID
const getData = asyncHandler(async (req, res) => {
  const teacherId = req.params.teacherId;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required.");
  }

  const teacher = await Teacher.findById(teacherId).select(
    "-password -refreshToken"
  );

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  res
    .status(200)
    .json(new Apiresponse(200, teacher, "Teacher fetched successfully."));
});

const getAllData = asyncHandler(async () => {
  const filter = {};

  const teacherList = await Teacher.find({ filter })
    .select("-password -refreshToken")
    .populate({
      path: "assignedSubjects",
      select: "subjectName",
      options: {
        sort: "subjectName",
      },
    });

  if (teacherList.length === 0) {
    throw new ApiError(404, "No teachers found");
  }

  return res
    .status(200)
    .json(new Apiresponse(200, teacherList, "Teachers fetched successfully"));
});

const totalDocument = asyncHandler(async (req, res) => {
  const count = await Teacher.countDocuments();

  if (!count) {
    throw new ApiError(404, "No teacher records found in the database.");
  }

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
  getData,
  getAllData,
  totalDocument,
};
