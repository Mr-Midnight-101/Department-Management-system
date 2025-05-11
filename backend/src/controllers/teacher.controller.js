// src/controllers/teacher.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming this utility exists and works
import Apiresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"; // Needed for refreshAccessToken

// ⭐ Helper function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      // This case should ideally not happen if called with a valid ID
      throw new ApiError(404, "Teacher not found during token generation.");
    }

    // Generate tokens using the model methods
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    // Save the refresh token to the database
    teacher.refreshToken = refreshToken;
    // Use save without validateBeforeSave: false unless absolutely necessary,
    // as pre-save hooks (like password hashing) still run by default.
    // Saving refresh token shouldn't require password validation.
    await teacher.save(); // Await the save operation

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error); // Log the specific error
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens."
    );
  }
};

// ⭐ Controller to register a new teacher
const registerTeacher = asyncHandler(async (req, res) => {
  const {
    fullName, // Use fullName consistent with model
    email,
    username,
    password,
    teacherId,
    contactInfo,
    // avatar is handled by multer/cloudinary
    // assignedSubjects will likely be added later or in a separate update
  } = req.body;

  // Validate required fields - using a more robust check
  if (
    [fullName, username, email, password, teacherId, contactInfo].some(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    // Include specific field names in the error for better debugging
    const missingField = [
      fullName,
      username,
      email,
      password,
      teacherId,
      contactInfo,
    ].find(
      (field) =>
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
    );
    throw new ApiError(
      400,
      `${missingField || "One or more required fields"} cannot be empty.`
    );
  }

  // Check if the teacher already exists by username, email, or teacherId
  const existedTeacher = await Teacher.findOne({
    $or: [{ username }, { email }, { teacherId }], // Added email and teacherId to check
  });

  if (existedTeacher) {
    // Provide more specific error message based on what exists
    let errorMessage = "Teacher already exists.";
    if (existedTeacher.username === username.toLowerCase())
      errorMessage = "Username already taken.";
    else if (existedTeacher.email === email.toLowerCase())
      errorMessage = "Email already registered.";
    else if (existedTeacher.teacherId === teacherId)
      errorMessage = "Teacher ID already registered.";

    throw new ApiError(409, errorMessage); // Use 409 Conflict for existing resource
  }

  // Handle avatar upload if a file was provided
  const avatarLocalpath = req.file?.path; // Use req.file for single file uploads

  let avatarImage = { url: "" }; // Default to empty URL if no avatar uploaded
  if (avatarLocalpath) {
    try {
      avatarImage = await uploadOnCloudinary(avatarLocalpath); // Upload to Cloudinary
      // Optionally, add validation if avatar is considered critical
      // if (!avatarImage || !avatarImage.url) {
      //   throw new ApiError(500, "Failed to upload avatar to Cloudinary!");
      // }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      // Decide how to handle upload failure: proceed without avatar, or throw error
      // For now, we'll log and proceed without avatar URL
      // throw new ApiError(500, "Failed to upload avatar."); // Uncomment to make avatar required/critical
    }
  }

  // Create the new teacher document
  const teacher = await Teacher.create({
    fullName: fullName.trim().toLowerCase(), // Trim and lowercase full name
    email: email.trim().toLowerCase(), // Trim and lowercase email
    username: username.trim().toLowerCase(), // Trim and lowercase username
    password, // Password will be hashed by the pre-save hook
    teacherId: teacherId.trim(), // Trim teacher ID
    avatar: avatarImage?.url || "", // Save avatar URL, default to empty string if upload failed
    contactInfo: contactInfo.trim(), // Trim contact info
    assignedSubjects: [], // Initialize as empty array, can be updated later
  });

  // Fetch the created teacher excluding sensitive fields
  const createdTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken" // Exclude password and refresh token
  );

  // Check if teacher creation was successful
  if (!createdTeacher) {
    // If findById fails after create, something went wrong during save
    throw new ApiError(
      500,
      "Something went wrong while registering the teacher."
    );
  }

  // Return a success response with the created teacher data
  return res
    .status(201) // Use 201 Created for successful resource creation
    .json(
      new Apiresponse(201, createdTeacher, "Teacher registered successfully.")
    ); // Corrected message
});

// ⭐ Controller to log in a teacher
const loginTeacher = asyncHandler(async (req, res) => {
  // Get login credentials from request body (username/email and password)
  const { username, email, password } = req.body;

  // Validate input: Require either username or email, and the password
  if ((!username && !email) || !password) {
    throw new ApiError(
      400,
      "Please provide either username or email and the password."
    );
  }

  // Find the teacher by username or email
  const teacher = await Teacher.findOne({
    $or: [{ username }, { email }],
  });

  // Check if the teacher exists
  if (!teacher) {
    throw new ApiError(404, "Teacher not found."); // Use 404 for not found
  }

  // Check if the password is correct
  const isPasswordCorrect = await teacher.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials."); // Use 401 Unauthorized for login failure
  }

  // If credentials are valid, generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    teacher._id
  );
  console.log(accessToken, refreshToken);

  // Fetch the logged-in teacher data, excluding sensitive fields
  const loggedInTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );

  // Configure cookie options
  const options = {
    httpOnly: true, // Cookie is not accessible via client-side scripts
    secure: process.env.NODE_ENV === "production", // Use secure flag in production (HTTPS)
    // Set maxAge based on refresh token expiry for consistency
    maxAge:
      parseInt(process.env.REFRESH_TOKEN_EXPIRY.replace("d", "")) *
      24 *
      60 *
      60 *
      1000, // Assuming expiry is in days (e.g., '7d')
  };

  // Return success response, setting tokens in httpOnly cookies
  return res
    .status(200) // Use 200 OK for successful login
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Apiresponse(
        200,
        loggedInTeacher, // Send user data in the response body
        "Teacher logged in successfully."
      )
    );
});

// ⭐ Controller to log out a teacher
const logoutTeacher = asyncHandler(async (req, res) => {
  // The verifyJWT middleware attaches the teacher object to req.teacher
  // Find the teacher by the ID from the authenticated user
  await Teacher.findByIdAndUpdate(
    req.teacher._id, // Use req.teacher._id provided by verifyJWT
    {
      // Use $unset to remove the refreshToken field from the document
      $unset: {
        refreshToken: 1, // Value doesn't matter for $unset
      },
    },
    {
      new: true, // Return the updated document (optional here, but good practice)
    }
  );

  // Configure cookie options for clearing
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  // Clear the access and refresh token cookies
  return res
    .status(200) // Use 200 OK for successful logout
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200, {}, "Teacher logged out successfully."));
});

// ⭐ Controller to refresh access token using refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get the refresh token from cookies or request body (cookies preferred)
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // If no refresh token is provided, user is unauthorized
  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Unauthorized request. Refresh token not provided."
    );
  }

  try {
    // Verify the incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find the teacher associated with the decoded token's ID
    const teacher = await Teacher.findById(decodedToken?._id);

    // If teacher not found or token payload is invalid
    if (!teacher) {
      throw new ApiError(401, "Unauthorized request. Invalid refresh token.");
    }

    // Check if the incoming refresh token matches the one stored in the database
    // This prevents token reuse
    if (incomingRefreshToken !== teacher.refreshToken) {
      // Consider clearing the token from the DB if it was somehow compromised/reused
      // teacher.refreshToken = undefined;
      // await teacher.save({ validateBeforeSave: false }); // Or handle appropriately
      throw new ApiError(
        401,
        "Refresh token is expired or invalid. Please log in again."
      );
    }

    // If everything is valid, generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(teacher._id); // Use alias for new token

    // Configure cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Set maxAge based on new refresh token expiry
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_EXPIRY.replace("d", "")) *
        24 *
        60 *
        60 *
        1000,
    };

    // Return success response, setting new tokens in httpOnly cookies
    return res
      .status(200) // Use 200 OK
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options) // Set the new refresh token
      .json(
        new Apiresponse(
          200,
          { accessToken, refreshToken: newRefreshToken }, // Optionally return tokens in body, but cookies are preferred
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    // Handle errors during token verification or lookup
    console.error("Error refreshing access token:", error);
    // Differentiate between JWT errors and other errors
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

// ⭐ Controller to change the teacher's current password
const changePassword = asyncHandler(async (req, res) => {
  // Renamed function
  // Get old and new passwords from request body
  const { oldPassword, newPassword } = req.body;

  // Validate input
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Please provide both old and new passwords.");
  }

  // Find the teacher using the ID from the authenticated user (via verifyJWT middleware)
  const teacher = await Teacher.findById(req.teacher._id).select("+password"); // Explicitly select password

  // Check if the old password is correct
  const isPasswordCorrect = await teacher.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password."); // Use 401 Unauthorized
  }

  // Check if the new password is the same as the old password
  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password."
    );
  }

  // Update the password field - the pre-save hook will hash it
  teacher.password = newPassword;

  // Save the updated teacher document
  await teacher.save(); // This will trigger the password hashing pre-save hook

  // Return success response
  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Password updated successfully."));
});

// ⭐ Controller to get the authenticated teacher's current user details
const getCurrentTeacher = asyncHandler(async (req, res) => {
  // Renamed function
  // The verifyJWT middleware attaches the teacher object to req.teacher
  // The teacher object from the middleware should already exclude sensitive fields
  if (!req.teacher) {
    throw new ApiError(401, "Teacher not authenticated."); // Should not happen if verifyJWT is used
  }
  return res.status(200).json(
    new Apiresponse(
      200,
      req.teacher, // Use the teacher object from req (already cleaned)
      "Current teacher details fetched successfully."
    )
  );
});

// ⭐ Controller to update non-sensitive teacher details
const updateTeacherDetails = asyncHandler(async (req, res) => {
  // Get updatable fields from request body
  const { fullName, email, username, teacherId, contactInfo } = req.body; // Use fullName

  // Basic validation: Check if at least one field is provided for update
  if (!(fullName || email || username || teacherId || contactInfo)) {
    throw new ApiError(400, "Please provide at least one field to update.");
  }

  // Optional: Add more specific validation for each field if needed (e.g., format)
  // Example: if (email && !isValidEmail(email)) throw new ApiError(400, "Invalid email format");

  // Find and update the teacher document
  // Note: This assumes username/email/teacherId uniqueness checks might need more complex logic
  // if the updated value conflicts with another *existing* user who is not the current user.
  // findByIdAndUpdate's default validation might handle this, but double check.
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id, // Find by authenticated teacher's ID
    {
      $set: {
        // Use $set to update specific fields
        // Only include fields that were actually provided in the body
        ...(fullName && { fullName: fullName.trim().toLowerCase() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(username && { username: username.trim().toLowerCase() }),
        ...(teacherId && { teacherId: teacherId.trim() }),
        ...(contactInfo && { contactInfo: contactInfo.trim() }),
      },
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators (important for uniqueness checks)
    }
  ).select("-password -refreshToken"); // Exclude sensitive fields

  // Check if update was successful (teacher might not be found, though unlikely after verifyJWT)
  if (!updatedTeacher) {
    throw new ApiError(404, "Teacher not found for update."); // Should not happen with verifyJWT
  }

  // Return success response with updated teacher data
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

// ⭐ Controller to update the teacher's avatar
const updateTeacherAvatar = asyncHandler(async (req, res) => {
  // Renamed function
  // Get the local path of the uploaded avatar file from multer
  const avatarLocalpath = req.file?.path;

  // Validate that a file was uploaded
  if (!avatarLocalpath) {
    throw new ApiError(400, "Avatar file is missing. Please upload a file.");
  }

  // Upload the file to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalpath); // Assuming this returns an object with a 'url' property

  // Validate that the Cloudinary upload was successful
  if (!avatar || !avatar.url) {
    // Optionally, clean up the local file here if upload fails
    // fs.unlinkSync(avatarLocalpath);
    throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
  }

  // Find the teacher and update their avatar URL
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id, // Find by authenticated teacher's ID
    {
      $set: {
        avatar: avatar.url, // Set the new avatar URL
      },
    },
    { new: true } // Return the updated document
  ).select("-password -refreshToken"); // Exclude sensitive fields

  // Check if update was successful
  if (!updatedTeacher) {
    // This is a critical error if teacher exists via verifyJWT but cannot be updated
    throw new ApiError(500, "Failed to update teacher avatar in the database.");
  }

  // Return success response with updated teacher data (including new avatar URL)
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

//getteacher
const getData = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  // console.log(teacherId);
  // console.log(req.params);
  // console.log(req.params.id);

  if (!teacherId) {
    console.log("error");
  }
  const teacher = await Teacher.findById(teacherId);
  res.status(200).json(new Apiresponse(200, teacher, "success"));
});
const getAllData = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({});
  // console.log(teacherId);
  // console.log(req.params);
  // console.log(req.params.id);

  if (!teachers) {
    console.log("error");
  }

  res.status(200).json(new Apiresponse(200, teachers, "success"));
});
const totalDocument = asyncHandler(async (req, res) => {
  const count = await Teacher.countDocuments();

  return res
    .status(200)
    .json(new Apiresponse(200, count, "document count successfully"));
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
