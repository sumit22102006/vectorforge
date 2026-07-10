import fs from 'fs/promises';
import path from 'path';
import { parseChatLog } from '../utils/chatParser.js';

const UPLOAD_DIR = './uploads';

/**
 * Service to manage reading upload files and triggering parser utilities
 * @param {string} filename - The name of the stored upload file
 * @returns {Promise<Array<Object>>} Parsed message entries list
 */
export const parseUploadedFile = async (filename) => {
  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    // Read the stored file content
    const rawContent = await fs.readFile(filePath, 'utf-8');
    
    // Parse using the utility logic
    const messages = parseChatLog(rawContent);
    
    return messages;
  } catch (err) {
    if (err.code === 'ENOENT') {
      const error = new Error(`Operational error: File "${filename}" could not be located in the storage directory.`);
      error.statusCode = 404;
      throw error;
    }
    throw err;
  }
};
