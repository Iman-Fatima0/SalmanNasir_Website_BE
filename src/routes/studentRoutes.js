const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { isStudent } = require('../middleware/admin');
const validate = require('../middleware/validation');
const { manualCheckoutSchema } = require('../validators/studentSchemas');

const router = express.Router();

// All student routes require authentication
router.use(authenticate);
router.use(isStudent);

// Courses (enrolled courses)
router.get('/courses', studentController.getCourses);
router.get('/courses/:id', studentController.getCourseById);

// Orders (purchase history)
router.get('/orders', studentController.getOrders);

// Manual checkout (submit order + payment proof)
router.post('/checkout', validate(manualCheckoutSchema), studentController.manualCheckout);

// Enrollments
router.get('/enrollments', studentController.getEnrollments);
router.get('/enrollments/:id', studentController.getEnrollmentById);
// Direct enrollment creation is disabled; enrollments are created via admin-approved orders
// Leaving the route defined for compatibility but handled as forbidden in controller
router.post('/enrollments', studentController.createEnrollment);

// Progress
router.get('/progress/:enrollmentId', studentController.getProgress);
router.put('/progress/:enrollmentId/lessons/:lessonId', studentController.updateLessonProgress);
router.post('/progress/:enrollmentId/quizzes/:quizId/attempt', studentController.submitQuizAttempt);

// Certificates
router.get('/certificates', studentController.getCertificates);
router.get('/certificates/:id', studentController.getCertificateById);
router.get('/certificates/verify/:code', studentController.verifyCertificate);

module.exports = router;

