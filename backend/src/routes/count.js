import { documents } from "../controllers/document.count.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const countRoute = Router();

countRoute.route("/count").get(documents);

export default countRoute;
