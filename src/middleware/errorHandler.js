const response = require('../utils/response');
const { AppError } = require('../utils/errors');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return response.error(res, 'Validation Error', 400, messages);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return response.error(res, 'Duplicate field value', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return response.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return response.error(res, 'Token expired', 401);
  }

  // Custom AppError
  if (err instanceof AppError) {
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
