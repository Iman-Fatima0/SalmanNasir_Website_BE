const Joi = require('joi');

const lessonSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Lesson title is required',
  }),
  description: Joi.string().optional().allow(null, ''),
  // Make order optional and default to 0 so frontend doesn't have to send it
  order: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Lesson order must be a number',
    'number.min': 'Lesson order must be greater than or equal to 0',
  }),
  // Accept lowercase types from frontend (e.g. "text") by uppercasing before validation
  type: Joi.string()
    .uppercase()
    .valid('VIDEO', 'PDF', 'TEXT', 'QUIZ', 'AUDIO')
    .optional()
    .default('VIDEO')
    .messages({
      'any.only': 'Lesson type must be one of VIDEO, PDF, TEXT, QUIZ, AUDIO',
    }),
  videoUrl: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().pattern(/^\/uploads\//), // File path pattern
      Joi.string().allow(null, '')
    )
    .optional()
    .allow(null, '')
    .messages({
      'alternatives.match': 'Video URL must be a valid URL or file path starting with /uploads/',
    }),
  audioUrl: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().pattern(/^\/uploads\//), // File path pattern
      Joi.string().allow(null, '')
    )
    .optional()
    .allow(null, '')
    .messages({
      'alternatives.match': 'Audio URL must be a valid URL or file path starting with /uploads/',
    }),
  contentUrl: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().pattern(/^\/uploads\//), // File path pattern
      Joi.string().allow(null, '')
    )
    .optional()
    .allow(null, '')
    .messages({
      'alternatives.match': 'Content URL must be a valid URL or file path starting with /uploads/',
    }),
  textContent: Joi.string().optional().allow(null, ''),
  durationMinutes: Joi.number().integer().min(0).optional().allow(null),
  isPreview: Joi.boolean().optional(),
});

const chapterSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Chapter title is required',
  }),
  description: Joi.string().optional().allow(null, ''),
  // Make order optional and default to 0 so frontend doesn't have to send it
  order: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Chapter order must be a number',
    'number.min': 'Chapter order must be greater than or equal to 0',
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
  thumbnailUrl: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().pattern(/^\/uploads\//), // File path pattern
      Joi.string().allow(null, '')
    )
    .optional()
    .allow(null, '')
    .messages({
      'alternatives.match': 'Thumbnail URL must be a valid URL or file path starting with /uploads/',
    }),
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
  thumbnailUrl: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().pattern(/^\/uploads\//), // File path pattern
      Joi.string().allow(null, '')
    )
    .optional()
    .allow(null, '')
    .messages({
      'alternatives.match': 'Thumbnail URL must be a valid URL or file path starting with /uploads/',
    }),
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

