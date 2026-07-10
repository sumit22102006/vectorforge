import express from 'express';
import { handleGetTrainingPairs } from '../controllers/trainingController.js';

const router = express.Router();

/**
 * @route   GET /api/training-pairs
 * @desc    Generate and retrieve training pairs (input -> output) for fine-tuning
 * @access  Public
 */
router.get('/training-pairs', handleGetTrainingPairs);

export default router;
