/*

! cloudinary is platform to upload a file. 
? We will be using multer for file uploading in cloudinary.We can use express.fileUpload as well but nowdays multer is first choice of developers
* first upload the file to local storage
* then storage file upload to cloudinary and get url of file 
* then unlink the file from local storage
* required:
? cloudinary to upload file in cloud
? multer to perform uploading in url retrival
? fs: filepath to local storage and after upload unlink the file
*/

import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
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
      console.log("uploaded sucesfully", uploadResult);
      return uploadResult;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

log("cloudinary: ", uploadOnCloudinary);

//_____________________________

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { log } from "console";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

log("Multer dirname", __dirname);
log("Multer filename", __filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/temp");

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Set the upload directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

log("Multer storage", storage);
export const upload = multer({
  storage,
});
log("Multer upload ", upload);
