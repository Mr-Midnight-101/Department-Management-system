import Router from "express";
import { recentActivityController } from "../controllers/recentActivity.controller.js";

export const recentActivityRoute = Router();

recentActivityRoute.route("/v1/recentactivity", recentActivityController);
