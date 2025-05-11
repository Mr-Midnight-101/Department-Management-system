// src/models/settings.model.js

import mongoose from "mongoose";

// Define the schema for application settings
const settingsSchema = new mongoose.Schema(
  {
    // Name of the application (e.g., displayed in the header)
    appName: {
      type: String,
      default: "College Department Management System", // Default application name
      trim: true,
    },
    // Application theme preference
    theme: {
      type: String,
      enum: ["light", "dark"], // Allowed theme values
      default: "light", // Default theme
      trim: true,
    },
    // User notification preferences
    notificationPreferences: {
      type: {
        // Embedded document structure for preferences
        email: {
          type: Boolean,
          default: true, // Email notifications enabled by default
        },
        push: {
          type: Boolean,
          default: true, // Push notifications enabled by default
        },
        sms: {
          type: Boolean,
          default: false, // SMS notifications disabled by default
        },
      },
      // Note: Mongoose handles default values for embedded objects correctly
      // Defaulting the outer object to {} is redundant if inner defaults exist
      // default: {}, // Can potentially remove this line
    },
    // Add other application-wide settings fields here as needed
    // e.g., contactEmail: { type: String, trim: true },
    // e.g., enableRegistration: { type: Boolean, default: true },
  },
  {
    // Mongoose timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Although we expect only one settings document, a unique index is hard to apply here.
// Relying on controller logic (findOneAndUpdate with upsert: true) to manage the single document.

// Create and export the Setting model
export const Setting = mongoose.model("Setting", settingsSchema);