import { asyncHandler } from "../utils/asyncHandler.js";
import { Activity } from "../models/recentActivity.model.js";
// routes/activity.js
export const recentActivityController = asyncHandler(async (req, res) => {
  const activities = await Activity.find().sort({ date: -1 }).limit(4);
  res.json(activities);
});
