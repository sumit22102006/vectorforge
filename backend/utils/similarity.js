/**
 * TF-IDF Cosine Similarity Utility
 * Lightweight, zero-dependency tokenization, term frequency indexing, and vector 
 * cosine similarity score calculation.
 */

// Tokenizes text, removing punctuation and standardizing to lowercase
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
};

// Computes Term Frequency (TF) map for token arrays
const getTF = (tokens) => {
  const tf = {};
  tokens.forEach((t) => {
    tf[t] = (tf[t] || 0) + 1;
  });
  return tf;
};

/**
 * Computes Cosine Similarity scores between a query text and an array of documents using TF-IDF vectors
 * @param {string} query - Query string to search
 * @param {Array<string>} documents - Array of text documents (inputs) to score
 * @returns {Array<number>} Array of cosine similarity scores [0.0 to 1.0] matching document indices
 */
export const calculateTFIDFSimilarities = (query, documents) => {
  if (!documents || documents.length === 0) return [];

  // Corpus comprises all documents plus the active query message
  const corpus = [...documents, query];
  const N = corpus.length;

  const docTokens = corpus.map((doc) => tokenize(doc));
  const docTFs = docTokens.map((tokens) => getTF(tokens));

  // Build vocabulary and Document Frequencies (DF)
  const vocab = new Set();
  const df = {};

  docTokens.forEach((tokens) => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((t) => {
      vocab.add(t);
      df[t] = (df[t] || 0) + 1;
    });
  });

  // Calculate Inverse Document Frequencies (IDF)
  const idf = {};
  vocab.forEach((term) => {
    // Adding 1 to prevent division by zero in case of unindexed terms
    idf[term] = Math.log(1 + N / (df[term] || 1));
  });

  // Build TF-IDF Vectors
  const docVectors = docTFs.map((tf) => {
    const vector = {};
    Object.keys(tf).forEach((term) => {
      vector[term] = tf[term] * idf[term];
    });
    return vector;
  });

  // Query vector is the final element in docVectors
  const queryVector = docVectors[docVectors.length - 1];

  let queryMagSq = 0;
  Object.values(queryVector).forEach((val) => {
    queryMagSq += val * val;
  });
  const queryMag = Math.sqrt(queryMagSq);

  // Compute cosine similarity for each document vector
  const similarities = documents.map((doc, idx) => {
    if (queryMag === 0) return 0;

    const docVector = docVectors[idx];
    let docMagSq = 0;
    let dotProduct = 0;

    Object.values(docVector).forEach((val) => {
      docMagSq += val * val;
    });
    
    const docMag = Math.sqrt(docMagSq);
    if (docMag === 0) return 0;

    // Dot product calculation
    Object.keys(queryVector).forEach((term) => {
      if (docVector[term]) {
        dotProduct += queryVector[term] * docVector[term];
      }
    });

    return dotProduct / (queryMag * docMag);
  });

  return similarities;
};
