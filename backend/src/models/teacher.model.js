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
      match: [/^[a-zA-Z ]+$/, "Full name must contain only letters"],
    },

    teacherEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    teacherUsername: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9]+$/,
        "Username must contain only letters and numbers (no special characters)",
      ],
    },
    teacherPassword: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
        },
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter and one number",
      },
    },
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^UICSA[A-Za-z0-9]{0,10}$/,
        "Invalid Teacher ID format. Contact the department",
      ],
      // only UICSA+ AZ{2} + NUmbers{4}
    },
    teacherAvatar: {
      type: String,
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
      match: [/^\d{10}$/, "Contact must be exactly 10 digits"],
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
