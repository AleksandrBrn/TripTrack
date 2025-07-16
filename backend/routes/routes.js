import express from 'express';
import { handleUpload } from '../controllers/routesController.js';

const router = express.Router();

router.post('/', handleUpload);

export default router;
