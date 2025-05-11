// src/routes/settings.routes.js // Corrected file name reference

import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/setting.controller.js"; // Corrected import path and names

const settingRoutes = Router(); // Kept original name

// Define routes for settings.
// Using the base path /api/settings (assuming this is how the router is used)

// Route to get the application settings (GET request)
// GET /api/settings/ or GET /api/settings/app
settingRoutes.route("/").get(getSettings); // Using the root path for the settings collection

// Route to update the application settings (PATCH request)
// PATCH /api/settings/ or PATCH /api/settings/app
// Using PATCH as we're likely doing a partial update via $set
settingRoutes.route("/").patch(updateSettings); // Changed method from GET to PATCH

// Alternatively, if you prefer specific paths like in the original:
// settingRoutes.route("/get").get(getSettings);
// settingRoutes.route("/update").patch(updateSettings);


// Export the router
export {settingRoutes};