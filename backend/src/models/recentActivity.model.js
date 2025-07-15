// models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
