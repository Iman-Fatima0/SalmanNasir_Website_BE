const express = require('express');
const instructorController = require('../controllers/instructorController');
const { authenticate } = require('../middleware/auth');
const { isInstructor } = require('../middleware/admin');
const { requireOwnership } = require('../middleware/rbac');

const router = express.Router();

// All instructor routes require authentication and instructor role
router.use(authenticate);
router.use(isInstructor);

// Analytics
router.get('/analytics/overview', instructorController.getAnalyticsOverview);
router.get('/analytics/courses/:courseId', instructorController.getCourseAnalytics);

// Course Management (own courses only)
router.get('/courses', instructorController.getMyCourses);
router.get('/courses/:id', requireOwnership('course', 'id'), instructorController.getCourseById);
router.put('/courses/:id', requireOwnership('course', 'id'), instructorController.updateCourse);

// Students (students enrolled in own courses)
router.get('/students', instructorController.getStudents);
router.get('/courses/:courseId/students', requireOwnership('course', 'courseId'), instructorController.getCourseStudents);
router.get('/courses/:courseId/students/:studentId', requireOwnership('course', 'courseId'), instructorController.getStudentProgress);

module.exports = router;
