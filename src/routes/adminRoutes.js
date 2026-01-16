const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const validate = require('../middleware/validation');
const validateQuery = require('../middleware/queryValidation');
const {
  createCourseSchema,
  updateCourseSchema,
  getCoursesQuerySchema,
} = require('../validators/courseSchemas');
const {
  createInstructorSchema,
  updateInstructorSchema,
  getInstructorsQuerySchema,
} = require('../validators/instructorSchemas');
const {
  updateOrderStatusSchema,
  updateUserSchema,
  getUsersQuerySchema,
  getOrdersQuerySchema,
} = require('../validators/adminSchemas');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.get('/users', validateQuery(getUsersQuerySchema), adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', validate(updateUserSchema), adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Order Management
router.get('/orders', validateQuery(getOrdersQuerySchema), adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), adminController.updateOrderStatus);

// Course Management (Admin)
router.post('/courses', validate(createCourseSchema), adminController.createCourse);
router.put('/courses/:id', validate(updateCourseSchema), adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Instructor Management (Admin)
router.post('/instructors', validate(createInstructorSchema), adminController.createInstructor);
router.put('/instructors/:id', validate(updateInstructorSchema), adminController.updateInstructor);
router.delete('/instructors/:id', adminController.deleteInstructor);

module.exports = router;

