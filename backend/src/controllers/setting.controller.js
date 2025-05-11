// src/controllers/settings.controller.js // Corrected file name reference

import { asyncHandler } from "../utils/asyncHandler.js"; // Assuming the path
import ApiError from "../utils/ApiError.js"; // Assuming the path
import Apiresponse from "../utils/Apiresponse.js"; // Assuming the path
import { Setting } from "../models/setting.model.js"; // Corrected import path

// ⭐ Controller function to get the current application settings
// Typically accessed via GET /api/settings/ or /api/settings/app
const getSettings = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching settings:", error); // Log the error for debugging
    // Throw a 500 error for unexpected server issues
    throw new ApiError(500, "Error fetching settings.");
  }
});

// ⭐ Controller function to update (or create if none exists) the application settings
// Typically accessed via PUT or PATCH /api/settings/ or /api/settings/app
const updateSettings = asyncHandler(async (req, res) => {
  // Get the updated settings data from the request body
  const updatedData = req.body; // Frontend sends the new values here

  // ⭐ Define allowed fields to be updated
  // Added notificationPreferences as an allowed update, assuming its sub-fields are handled by Mongoose casting/defaults
  const allowedUpdates = ["appName", "theme", "notificationPreferences"];
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

  // ⭐ Add specific validation for 'theme' if it's being updated
  if (updatesToApply.hasOwnProperty("theme")) {
    const allowedThemes = ["light", "dark"]; // Match your schema enum
    if (!allowedThemes.includes(updatesToApply.theme)) {
      throw new ApiError(
        400,
        `Invalid theme value: "${
          updatesToApply.theme
        }". Allowed values are: ${allowedThemes.join(", ")}.`
      );
    }
  }

  // ⭐ Add validation for notificationPreferences if needed (e.g., ensure it's an object)
  if (updatesToApply.hasOwnProperty("notificationPreferences")) {
      if (typeof updatesToApply.notificationPreferences !== 'object' || updatesToApply.notificationPreferences === null) {
           throw new ApiError(400, "Notification preferences must be an object.");
      }
      // Optional: Add checks for specific keys within notificationPreferences if needed
      // const allowedNotifKeys = ['email', 'push', 'sms'];
      // for(const notifKey in updatesToApply.notificationPreferences) {
      //     if(!allowedNotifKeys.includes(notifKey)) {
      //          throw new ApiError(400, `Invalid notification preference key: ${notifKey}`);
      //     }
      //     if(typeof updatesToApply.notificationPreferences[notifKey] !== 'boolean') {
      //          throw new ApiError(400, `Notification preference '${notifKey}' must be a boolean.`);
      //     }
      // }
  }


  try {
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
      console.error("Failed to update or create settings document despite upsert: true.");
      throw new ApiError(500, "Failed to update or create settings document.");
    }

    // Return the updated (or newly created) settings document
    return res
      .status(200) // Use 200 OK for successful update
      .json(new Apiresponse(200, settings, "Settings updated successfully.")); // Corrected message
  } catch (error) {
    console.error("Error updating settings:", error); // Log the error for debugging
    // Check if it's a Mongoose validation error (e.g., if runValidators caught something)
    if (error.name === "ValidationError") {
      // Mongoose might throw a ValidationError if upsert creates a doc and default validation fails,
      // or if runValidators is true and a constraint is violated (though we added explicit checks).
      // Return 400 for validation errors.
      throw new ApiError(400, error.message);
    }
    // For other unexpected errors
    throw new ApiError(500, "Error updating settings.");
  }
});

// Export the controller functions
export { getSettings, updateSettings };