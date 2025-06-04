import { Router } from "express";
import {
  getSettings,
  updateSettings,

} from "../controllers/setting.controller.js"; // Corrected import path and names

const settingRoutes = Router(); 


settingRoutes.route("/").get(getSettings).patch(updateSettings); 


// Export the router
export {settingRoutes};