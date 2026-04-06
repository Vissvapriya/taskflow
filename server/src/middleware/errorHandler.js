// Centralized Error Handling Middleware
// Catch errors from controllers and send appropriate responses

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  
  // Validation Error (from validator package or custom validation)
  if (err.name === 'ValidationError' || err.isValidationError) {
    statusCode = 400;
    message = err.message || 'Validation failed';
  }
  
  // MongoDB Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  
  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Custom error with statusCode
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
