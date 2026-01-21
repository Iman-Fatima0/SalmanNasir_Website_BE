const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(100).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().min(1).max(100).required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(1).max(100).required().messages({
    'any.required': 'Last name is required',
  }),
  phone: Joi.string()
    .optional()
    .allow(null, '')
    .custom((value, helpers) => {
      if (!value || value === '') {
        return value; // Allow null/empty
      }
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Check if it has 11-15 digits
      if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
        return value; // Return original value
      }
      return helpers.error('string.phone');
    })
    .messages({
      'string.phone': 'Phone number must contain 11 to 15 digits',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required',
  }),
  password: Joi.string().min(8).max(100).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'First name must be at least 1 character long',
    'string.max': 'First name must not exceed 100 characters',
  }),
  lastName: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Last name must be at least 1 character long',
    'string.max': 'Last name must not exceed 100 characters',
  }),
  phone: Joi.string()
    .optional()
    .allow(null, '')
    .custom((value, helpers) => {
      if (!value || value === '') {
        return value; // Allow null/empty
      }
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Check if it has 11-15 digits
      if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
        return value; // Return original value
      }
      return helpers.error('string.phone');
    })
    .messages({
      'string.phone': 'Phone number must contain 11 to 15 digits',
    }),
  profileImage: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Profile image must be a valid URL',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
};

