export const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `An entry with this ${field} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: messages.join('. '),
    });
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Resource not found with invalid id format: ${err.value}`,
    });
  }

  // Multer Error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 50MB limit.' });
    }
    return res.status(400).json({ message: err.message || 'File upload error' });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
