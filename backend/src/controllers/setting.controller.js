// src/controllers/settings.controller.js // Corrected file name reference

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { Setting } from "../models/setting.model.js";

// ⭐ Controller function to get the current application settings
// Typically accessed via GET /api/settings/ or /api/settings/app
const getSettings = asyncHandler(async (req, res) => {
  // Find the single settings document. If none exists, this returns null.
  // We query for any document, expecting only one globally.
  const settings = await Setting.findOne({});

  // Return the found settings document or null if not found.
  // The frontend can then use default values if null is returned.
  return res.status(200).json(
    new Apiresponse(
      200,
      settings, // Data payload is the settings document or null
      settings
        ? "Settings fetched successfully." // Added period for consistency
        : "Application settings not found (using defaults)." // Improved message
    )
  );
});

// ⭐ Controller function to update (or create if none exists) the application settings
// Typically accessed via PUT or PATCH /api/settings/ or /api/settings/app
const updateSettings = asyncHandler(async (req, res) => {
  // Get the updated settings data from the request body
  const updatedData = req.body; // Frontend sends the new values here

  // ⭐ Define allowed fields to be updated
  // Added notificationPreferences as an allowed update, assuming its sub-fields are handled by Mongoose casting/defaults
  const allowedUpdates = ["appName", "appTheme", "notificationSettings"];
  const updatesToApply = {};

  // Filter the request body to only include allowed fields
  for (const key of allowedUpdates) {
    // Check if the key exists in the request body and is not null/undefined
    if (updatedData.hasOwnProperty(key) && updatedData[key] !== undefined && updatedData[key] !== null) {
      updatesToApply[key] = updatedData[key];
    }
  }

  // Basic validation: Check if at least one allowed field was provided for update
  if (Object.keys(updatesToApply).length === 0) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  // ⭐ Add specific validation for 'appTheme' if it's being updated
  if (updatesToApply.hasOwnProperty("appTheme")) {
    const allowedThemes = ["light", "dark"]; // Match your schema enum
    if (!allowedThemes.includes(updatesToApply.appTheme)) {
      throw new ApiError(
        400,
        `Invalid theme value: "${
          updatesToApply.appTheme
        }". Allowed values are: ${allowedThemes.join(", ")}.`
      );
    }
  }

  // ⭐ Add validation for notificationSettings if needed (e.g., ensure it's an object)
  if (updatesToApply.hasOwnProperty("notificationSettings")) {
    if (typeof updatesToApply.notificationSettings !== 'object' || updatesToApply.notificationSettings === null) {
      throw new ApiError(400, "Notification settings must be an object.");
    }
  }

  // Use findOneAndUpdate with upsert: true
  // This finds the first document, updates it with $set using the filtered data.
  // If no document is found, it creates a new one.
  const settings = await Setting.findOneAndUpdate(
    {}, // Query: Find any document (expecting only one)
    { $set: updatesToApply }, // ⭐ Update: Use $set with the FILTERED data
    {
      new: true, // ⭐ Return the updated document (or the newly created one)
      upsert: true, // ⭐ Create the document if it doesn't exist if no document found
      runValidators: true, // ⭐ Run schema validators on the update operation
      setDefaultsOnInsert: true // ⭐ Apply schema defaults when creating a new document via upsert
    }
  );

  if (!settings) {
    // This case should ideally not happen with upsert: true and setDefaultsOnInsert: true,
    // but as a safeguard against unexpected Mongoose behavior.
    throw new ApiError(500, "Failed to update or create settings document.");
  }

  // Return the updated (or newly created) settings document
  return res
    .status(200) // Use 200 OK for successful update
    .json(new Apiresponse(200, settings, "Settings updated successfully.")); // Corrected message
});

// Export the controller functions
export { getSettings, updateSettings };