const express = require('express');
const courseController = require('../controllers/courseController');
const validate = require('../middleware/validation');
const validateQuery = require('../middleware/queryValidation');
const {
  createCourseSchema,
  updateCourseSchema,
  getCoursesQuerySchema,
} = require('../validators/courseSchemas');

const router = express.Router();

// Course routes
router.post('/', validate(createCourseSchema), courseController.create);
router.get('/', validateQuery(getCoursesQuerySchema), courseController.getAll);
router.get('/:id', courseController.getById);
router.put('/:id', validate(updateCourseSchema), courseController.update);
router.delete('/:id', courseController.delete);

module.exports = router;

