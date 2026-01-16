const Joi = require('joi');

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'cancelled', 'refunded').required(),
  notes: Joi.string().optional().allow(null, ''),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().allow(null, ''),
  isEmailVerified: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

const getOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid('pending', 'completed', 'cancelled', 'refunded').optional(),
  search: Joi.string().optional(),
});

module.exports = {
  updateOrderStatusSchema,
  updateUserSchema,
  getUsersQuerySchema,
  getOrdersQuerySchema,
};

