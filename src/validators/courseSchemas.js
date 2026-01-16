const Joi = require('joi');

const lessonSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Lesson title is required',
  }),
  description: Joi.string().optional().allow(null, ''),
  order: Joi.number().integer().min(0).required().messages({
    'any.required': 'Lesson order is required',
  }),
  videoUrl: Joi.string().uri().optional().allow(null, ''),
  durationMinutes: Joi.number().integer().min(0).optional().allow(null),
  isPreview: Joi.boolean().optional(),
});

const chapterSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Chapter title is required',
  }),
  description: Joi.string().optional().allow(null, ''),
  order: Joi.number().integer().min(0).required().messages({
    'any.required': 'Chapter order is required',
  }),
  lessons: Joi.array().items(lessonSchema).optional(),
});

const createCourseSchema = Joi.object({
  // If productId is provided, link to existing product (product fields become optional)
  // If productId is not provided, create new product (product fields are required)
  productId: Joi.string().uuid().optional().messages({
    'string.guid': 'Product ID must be a valid UUID',
  }),
  title: Joi.string().when('productId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      'any.required': 'Course title is required when creating a new product',
    }),
  }),
  subtitle: Joi.string().optional().allow(null, ''),
  description: Joi.string().when('productId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      'any.required': 'Course description is required when creating a new product',
    }),
  }),
  price: Joi.number().min(0).when('productId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      'any.required': 'Course price is required when creating a new product',
      'number.min': 'Price must be greater than or equal to 0',
    }),
  }),
  currency: Joi.string().length(3).optional().default('USD'),
  language: Joi.string().optional().allow(null, ''),
  level: Joi.string().optional().allow(null, ''),
  thumbnailUrl: Joi.string().uri().optional().allow(null, ''),
  slug: Joi.string().optional(),
  chapters: Joi.array().items(chapterSchema).optional(),
  instructorIds: Joi.array().items(Joi.string().uuid()).optional(),
  instructorRole: Joi.string().optional().default('primary'),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().optional(),
  subtitle: Joi.string().optional().allow(null, ''),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional(),
  language: Joi.string().optional().allow(null, ''),
  level: Joi.string().optional().allow(null, ''),
  thumbnailUrl: Joi.string().uri().optional().allow(null, ''),
  isPublished: Joi.boolean().optional(),
  chapters: Joi.array().items(chapterSchema).optional(),
  instructorIds: Joi.array().items(Joi.string().uuid()).optional(),
  instructorRole: Joi.string().optional(),
});

const getCoursesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().optional(),
  level: Joi.string().optional(),
  language: Joi.string().optional(),
  isPublished: Joi.boolean().optional(),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  getCoursesQuerySchema,
};

