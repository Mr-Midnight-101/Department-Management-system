// src/models/teacher.model.js

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the schema for the Teacher model
const teacherSchema = new mongoose.Schema(
  {
    // Full name of the teacher
    fullName: { // Changed from fullname to fullName for consistency
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Teacher's email address, must be unique
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Username for login, must be unique and indexed for quick lookups
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    // Teacher's password (hashed)
    password: {
      type: String,
      required: [true, "Password is required"], // Added validation message
      // Note: Do not select password by default in queries
    },
    // Unique identifier for the teacher (e.g., employee ID)
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // URL for the teacher's avatar image (optional)
    avatar: {
      type: String, // Cloudinary URL
      required: false, // Avatar is not mandatory
    },
    // Array of subjects assigned to this teacher
    assignedSubjects: [ // Changed from AssignedSubject to assignedSubjects (array)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject", // Reference to the Subject model
      },
    ],
    // Teacher's contact information (e.g., phone number), must be unique
    contactInfo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Refresh token for maintaining user session
    refreshToken: {
      type: String,
    },
  },
  {
    // Mongoose timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Mongoose Pre-Save Hook: Hash the password before saving the user document
teacherSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash the password using bcrypt
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to the next middleware or save operation
  } catch (error) {
    // Pass hashing errors to the next middleware
    next(error);
  }
});

// Mongoose Method: Compare the entered password with the hashed password in the database
teacherSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  try {
    // Use bcrypt to compare the plaintext password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    // Handle potential errors during comparison
    console.error("Error comparing passwords:", error); // Log error for debugging
    return false; // Assume password is not correct on error
  }
};

// Mongoose Method: Generate an Access Token for the user
teacherSchema.methods.generateAccessToken = function () {
  // Sign the JWT with a payload containing user information
  return jwt.sign(
    {
      _id: this._id, // User ID
      email: this.email, // User email
      username: this.username, // Username
      fullName: this.fullName, // Include full name (consistent with schema)
    },
    process.env.ACCESS_TOKEN_SECRET, // Secret key from environment variables
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Expiry time from environment variables
    }
  );
};

// Mongoose Method: Generate a Refresh Token for the user
teacherSchema.methods.generateRefreshToken = function () {
  // Sign the JWT with a minimal payload (usually just user ID)
  return jwt.sign(
    {
      _id: this._id, // User ID
    },
    process.env.REFRESH_TOKEN_SECRET, // Secret key from environment variables
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Expiry time from environment variables
    }
  );
};

// Create and export the Teacher model
export const Teacher = mongoose.model("Teacher", teacherSchema);