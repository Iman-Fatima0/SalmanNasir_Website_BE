const express = require('express');
const instructorController = require('../controllers/instructorController');
const validate = require('../middleware/validation');
const validateQuery = require('../middleware/queryValidation');
const {
  createInstructorSchema,
  updateInstructorSchema,
  getInstructorsQuerySchema,
} = require('../validators/instructorSchemas');

const router = express.Router();

// Instructor routes
router.post('/', validate(createInstructorSchema), instructorController.create);
router.get('/', validateQuery(getInstructorsQuerySchema), instructorController.getAll);
router.get('/:id', instructorController.getById);
router.put('/:id', validate(updateInstructorSchema), instructorController.update);
router.delete('/:id', instructorController.delete);

module.exports = router;

