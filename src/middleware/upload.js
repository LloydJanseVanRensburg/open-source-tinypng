import multer from "multer";
import fileDirName from "../utils/dirname.js";
import path from "path";

const { __dirname } = fileDirName(import.meta);
const uploadDirPath = path.join(__dirname, '..', '..', 'uploads');

const upload = multer({ dest: uploadDirPath });

export const uploadMiddleware = upload.array('files');
