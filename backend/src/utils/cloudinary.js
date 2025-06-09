import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filepath) => {
  if (!filepath) {
    return null;
  }
  const uploading = await cloudinary.uploader.upload(filepath, {
    resource_type: "auto",
  });
  fs.unlinkSync(filepath, () => {
    console.log("file deleted successfully");
  });
  return uploading;
};
