import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getLocalizedMessage } from "./i18nHelper";

type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void;

const uploadDir = "backend/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip', 'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(getLocalizedMessage(req, "notAllowedFile")), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024
  }
})

export default upload;