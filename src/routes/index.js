import { Router } from 'express';
import { getHomePage, postReduceImages, getDownloadFileById } from '../controllers/index.js'
import {uploadMiddleware} from "../middleware/upload.js";

const router = Router();

router.get('/', getHomePage)

router.post('/reduce-images', uploadMiddleware, postReduceImages)

router.get('/download/:filename', getDownloadFileById)

export default router;
