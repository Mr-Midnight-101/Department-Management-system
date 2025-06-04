import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const teacherSchema = new mongoose.Schema(
  {
    teacherFullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    teacherEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    teacherUsername: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    teacherPassword: {
      type: String,
      required: [true, "Password is required"],
    },
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teacherAvatar: {
      type: String,
      required: false,
    },
    teacherAssignedSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    teacherContactInfo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teacherRefreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("teacherPassword")) return next();

  try {
    this.teacherPassword = await bcrypt.hash(this.teacherPassword, 10);
    next();
  } catch (error) {
    next(error);
  }
});

teacherSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.teacherPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

teacherSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.teacherEmail,
      username: this.teacherUsername,
      fullName: this.teacherFullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

teacherSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Teacher = mongoose.model("Teacher", teacherSchema);
