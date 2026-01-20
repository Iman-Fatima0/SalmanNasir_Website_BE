const Joi = require('joi');

/**
 * Manual checkout schema
 * Used when a logged-in student submits a manual payment for a course.
 */
const manualCheckoutSchema = Joi.object({
  courseId: Joi.string().uuid().required().messages({
    'any.required': 'Course ID is required',
    'string.guid': 'Course ID must be a valid UUID',
  }),
  paymentProofUrl: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Payment proof URL must be a valid URL',
    }),
  transactionReference: Joi.string().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
});

module.exports = {
  manualCheckoutSchema,
};


