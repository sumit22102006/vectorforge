import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = './uploads';

// Programmatically verify or build the storage folder to avoid operational errors
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Storage Strategy: Saves files locally with unique names to prevent file collisions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Sanitize filename and prepend unique key
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${uniquePrefix}-${sanitizedName}`);
  }
});

// File Validation filter: Validates extensions, accepting only WhatsApp export .txt logs
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.txt') {
    const error = new Error('File validation failed: Only exported WhatsApp chat files (.txt) are allowed.');
    error.statusCode = 400;
    return cb(error, false);
  }
  cb(null, true);
};

// Strict upload configurations
export const uploadConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Strict size ceiling at 10 MB
  }
});
