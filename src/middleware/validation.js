const { ValidationError } = require('../utils/errors');

/**
 * Request validation middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'validation.js:11',message:'Validation middleware called',data:{method:req.method,path:req.path,bodyKeys:Object.keys(req.body||{})},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      // Log validation errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Validation errors:', errors);
        console.error('Request body:', JSON.stringify(req.body, null, 2));
      }

      return next(new ValidationError('Validation failed', errors));
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

module.exports = validate;
