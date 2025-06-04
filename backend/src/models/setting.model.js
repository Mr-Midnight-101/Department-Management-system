import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      trim: true,
      default: "College Department Management System",
    },
    appTheme: {
      type: String,
      enum: ["light", "dark"],
      trim: true,
      default: "light",
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingsSchema);
