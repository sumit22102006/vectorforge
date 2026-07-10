import express from 'express';
import { handleGetSimilarPairs } from '../controllers/retrievalController.js';

const router = express.Router();

/**
 * @route   GET /api/retrieve
 * @desc    Retrieve the 5 most semantically similar chat reply pairs using TF-IDF
 * @access  Public
 */
router.get('/retrieve', handleGetSimilarPairs);

export default router;
