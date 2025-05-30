import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { loadEnvFile } from "process";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    } else {
      const uploadResult = await cloudinary.uploader
        .upload(localFilePath, {
          resource_type: "auto",
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(uploadResult.url);
      fs.unlinkSync(localFilePath);
      return uploadResult;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
