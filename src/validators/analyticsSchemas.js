const Joi = require('joi');

const getRevenueAnalyticsSchema = Joi.object({
  period: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').default('monthly'),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
}).unknown(false);

module.exports = {
  getRevenueAnalyticsSchema,
};

