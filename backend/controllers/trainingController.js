import { generateTrainingPairs } from '../services/trainingService.js';

/**
 * Controller to extract and return AI training pairs from a parsed chat log
 */
export const handleGetTrainingPairs = async (req, res, next) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      const error = new Error('Query parameter "filename" is required.');
      error.statusCode = 400;
      throw error;
    }

    const trainingPairs = await generateTrainingPairs(filename);

    res.status(200).json({
      success: true,
      count: trainingPairs.length,
      data: trainingPairs
    });
  } catch (err) {
    next(err);
  }
};
