import express from 'express';
import { handleBuildPrompt } from '../controllers/promptController.js';

const router = express.Router();

/**
 * @route   POST /api/build-prompt
 * @desc    Builds a complete system prompt and few-shot messages array for Llama 3
 * @access  Public
 */
router.post('/build-prompt', handleBuildPrompt);

export default router;
