import { retrieveSimilarPairs } from '../services/retrievalService.js';

/**
 * Controller to search and retrieve semantically similar chat logs
 */
export const handleGetSimilarPairs = async (req, res, next) => {
  try {
    const { filename, query } = req.query;

    if (!filename || !query) {
      const error = new Error('Missing query parameters: Both "filename" and "query" are required.');
      error.statusCode = 400;
      throw error;
    }

    const matches = await retrieveSimilarPairs(filename, query);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};
