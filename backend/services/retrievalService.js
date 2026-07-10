import { generateTrainingPairs } from './trainingService.js';
import { calculateTFIDFSimilarities } from '../utils/similarity.js';

/**
 * Service to retrieve the 5 most semantically similar training pairs matching a query
 * @param {string} filename - Stored chat log file name
 * @param {string} queryText - New incoming message text
 * @returns {Promise<Array<Object>>} Top 5 relevant pairs including similarity scores
 */
export const retrieveSimilarPairs = async (filename, queryText) => {
  // 1. Fetch all training pairs
  const pairs = await generateTrainingPairs(filename);

  if (pairs.length === 0) return [];

  // 2. Extract input texts to act as the documents corpus
  const documents = pairs.map((p) => p.input);

  // 3. Compute TF-IDF Cosine Similarity scores
  const scores = calculateTFIDFSimilarities(queryText, documents);

  // 4. Map scores to pairs
  const ratedPairs = pairs.map((pair, idx) => ({
    ...pair,
    similarity: Math.round(scores[idx] * 1000) / 1000 // Round score to 3 decimals
  }));

  // 5. Sort by descending similarity and return top 5
  return ratedPairs
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
};
