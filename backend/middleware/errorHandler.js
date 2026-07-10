import multer from 'multer';

// Custom error handling middleware mapping runtime and system issues to client responses
export const errorHandler = (err, req, res, next) => {
  // Intercept specific Multer failures
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File size limit exceeded. Maximum allowable size is 10 MB.'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Multer file upload error: ${err.message}`
    });
  }

  // Fallback structure for general exceptions
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    // Safely hide trace stack in production setups
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
