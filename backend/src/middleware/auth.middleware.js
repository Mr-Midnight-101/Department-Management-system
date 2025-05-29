// middle ware to verfiy the user
//req.user
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // token access using cookies because if req have acess,if cookies access is denied we use header "authorizations"
  // we send Authorization = Bearer <token>
  // we can replace or split (changes to array and get access of index 1 )
  try {
      // Attempt to retrieve the token from cookies or headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      console.log("verify JWT",token)
      console.log("verify JWT",req.cookies?.accessToken)
      console.log("verify JWT",req.header("Authorization")?.replace("Bearer ", ""))
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    //we need to verify the token

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// Find the teacher associated with the token
    const teacher = await Teacher.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!teacher) {
      throw new ApiError(401, "Invalid access token");
    }
    req.teacher = teacher;
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token");
  }
  next();
});
