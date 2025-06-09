import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentFileDir = path.dirname(currentFilePath);
const createdDir = path.join(currentFilePath, "../../../public/temp");

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(createdDir)) {
      fs.mkdirSync(createdDir);
    }
    cb(null, createdDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });
console.log("upload", upload);

