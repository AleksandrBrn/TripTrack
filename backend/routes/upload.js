import express from 'express';
import multer from 'multer';
import { handleUpload } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), handleUpload);

export default router;
