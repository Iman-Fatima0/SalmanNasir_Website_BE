const Joi = require('joi');

const createInstructorSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  bio: Joi.string().optional().allow(null, ''),
  avatarUrl: Joi.string().uri().optional().allow(null, ''),
  title: Joi.string().optional().allow(null, ''),
  linkedinUrl: Joi.string().uri().optional().allow(null, ''),
  twitterUrl: Joi.string().uri().optional().allow(null, ''),
  websiteUrl: Joi.string().uri().optional().allow(null, ''),
  isActive: Joi.boolean().optional().default(true),
});

const updateInstructorSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  bio: Joi.string().optional().allow(null, ''),
  avatarUrl: Joi.string().uri().optional().allow(null, ''),
  title: Joi.string().optional().allow(null, ''),
  linkedinUrl: Joi.string().uri().optional().allow(null, ''),
  twitterUrl: Joi.string().uri().optional().allow(null, ''),
  websiteUrl: Joi.string().uri().optional().allow(null, ''),
  isActive: Joi.boolean().optional(),
});

const getInstructorsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createInstructorSchema,
  updateInstructorSchema,
  getInstructorsQuerySchema,
};

