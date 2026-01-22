const response = require('../utils/response');
const { AppError } = require('../utils/errors');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error (always log in development, log in production for 500 errors)
  if (process.env.NODE_ENV === 'development' || (!error.statusCode || error.statusCode >= 500)) {
    console.error('\n=== ERROR ===');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    console.error('Request Method:', req.method);
    console.error('Request Path:', req.path);
    if (req.body && Object.keys(req.body).length > 0) {
      console.error('Request Body:', JSON.stringify(req.body, null, 2));
    }
    if (err.original) {
      console.error('Original Error:', err.original);
    }
    console.error('================\n');
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return response.error(res, 'Validation Error', 400, messages);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return response.error(res, 'Duplicate field value', 400);
  }

  // Sequelize database connection error
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return response.error(res, 'Database connection error. Please try again later.', 503);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return response.error(res, 'Invalid reference. The related record does not exist.', 400);
  }

  // Sequelize database error
  if (err.name && err.name.startsWith('Sequelize')) {
    const message = err.message || 'Database error occurred';
    return response.error(res, message, 500);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return response.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return response.error(res, 'Token expired', 401);
  }

  // Custom AppError (including ValidationError)
  if (err instanceof AppError) {
    // Log validation errors in development
    if (process.env.NODE_ENV === 'development' && err.errors) {
      console.error('\n=== VALIDATION ERRORS ===');
      console.error('Message:', err.message);
      console.error('Status Code:', err.statusCode);
      console.error('Errors:', JSON.stringify(err.errors, null, 2));
      console.error('Request Method:', req.method);
      console.error('Request Path:', req.path);
      console.error('Request Body:', JSON.stringify(req.body, null, 2));
      console.error('========================\n');
    }
    return response.error(res, err.message, err.statusCode, err.errors);
  }

  // Default server error
  return response.error(
    res,
    error.message || 'Server Error',
    error.statusCode || 500
  );
};

module.exports = errorHandler;
