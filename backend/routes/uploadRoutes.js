import express from 'express';
import { uploadConfig } from '../config/multer.js';
import { uploadChatFiles } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload one or multiple WhatsApp chat export .txt logs
 * @access  Public
 */
router.post('/upload', uploadConfig.array('files', 10), uploadChatFiles);

export default router;
