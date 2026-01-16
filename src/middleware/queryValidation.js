const { ValidationError } = require('../utils/errors');

/**
 * Query parameter validation middleware
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new ValidationError('Validation failed', errors));
    }

    // Replace req.query with validated and sanitized value
    req.query = value;
    next();
  };
};

module.exports = validateQuery;

