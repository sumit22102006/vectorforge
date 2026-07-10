import express from 'express';
import { handleBuildPrompt } from '../controllers/promptController.js';

const router = express.Router();

/**
 * @route   POST /api/build-prompt
 * @desc    Generate Llama 3.2 system prompts and compiled few-shot message payloads
 * @access  Public
 */
router.post('/build-prompt', handleBuildPrompt);

export default router;
