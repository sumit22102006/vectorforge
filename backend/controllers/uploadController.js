// Controller to manage WhatsApp chat file upload payloads and compile metadata
export const uploadChatFiles = (req, res, next) => {
  try {
    // Standardize files list from array-based upload requests
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      const error = new Error('No files provided. Please attach at least one valid WhatsApp chat export (.txt).');
      error.statusCode = 400;
      throw error;
    }

    // Compile file metadata logs
    const metadata = files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      size: `${(file.size / (1024 * 1024)).toFixed(3)} MB`,
      bytes: file.size,
      uploadTime: new Date().toISOString()
    }));

    res.status(200).json({
      success: true,
      message: 'WhatsApp chat logs uploaded and stored successfully.',
      count: metadata.length,
      files: metadata
    });
  } catch (err) {
    next(err);
  }
};
