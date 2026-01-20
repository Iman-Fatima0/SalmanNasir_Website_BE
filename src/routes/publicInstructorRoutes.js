const express = require('express');
const instructorRepository = require('../repositories/instructorRepository');
const validateQuery = require('../middleware/queryValidation');
const { getInstructorsQuerySchema } = require('../validators/instructorSchemas');
const response = require('../utils/response');

const router = express.Router();

/**
 * Get all instructors (public)
 * GET /api/instructors
 */
router.get(
  '/',
  validateQuery(getInstructorsQuerySchema),
  async (req, res, next) => {
    try {
      const result = await instructorRepository.findAll(req.query);
      return response.success(res, result, 'Instructors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get instructor by ID (public)
 * GET /api/instructors/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const includeCourses = req.query.includeCourses === 'true';
    const instructor = await instructorRepository.findById(req.params.id, includeCourses);
    
    if (!instructor) {
      return response.error(res, 'Instructor not found', 404);
    }
    
    return response.success(res, { instructor }, 'Instructor retrieved successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

