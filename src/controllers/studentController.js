const studentService = require('../services/studentService');
const response = require('../utils/response');

class StudentController {
  /**
   * Manual checkout: create a pending order with manual payment proof
   */
  async manualCheckout(req, res, next) {
    try {
      const order = await studentService.createManualOrder(req.user.id, req.body);
      return response.success(
        res,
        order,
        'Checkout submitted successfully. Your payment is under review.',
        201
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get all courses for the authenticated student (enrolled courses)
   */
  async getCourses(req, res, next) {
    try {
      const courses = await studentService.getCourses(req.user.id, req.query);
      return response.success(res, courses, 'Courses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all enrollments for the authenticated student
   */
  async getEnrollments(req, res, next) {
    try {
      const enrollments = await studentService.getEnrollments(req.user.id, req.query);
      return response.success(res, enrollments, 'Enrollments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get enrollment by ID (must belong to the authenticated student)
   */
  async getEnrollmentById(req, res, next) {
    try {
      const enrollment = await studentService.getEnrollmentById(
        req.params.id,
        req.user.id
      );
      return response.success(res, { enrollment }, 'Enrollment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create enrollment (enroll in a course)
   */
  async createEnrollment(req, res, next) {
    // Direct enrollment creation is not allowed in the manual payment flow.
    // Enrollments are created only after an admin verifies the order.
    return response.error(
      res,
      'Direct enrollment creation is disabled. Please complete checkout and wait for admin verification.',
      403
    );
  }

  /**
   * Get progress for an enrollment
   */
  async getProgress(req, res, next) {
    try {
      const progress = await studentService.getProgress(
        req.params.enrollmentId,
        req.user.id
      );
      return response.success(res, progress, 'Progress retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(req, res, next) {
    try {
      const progress = await studentService.updateLessonProgress(
        req.params.enrollmentId,
        req.params.lessonId,
        req.user.id,
        req.body
      );
      return response.success(res, progress, 'Progress updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(req, res, next) {
    try {
      const attempt = await studentService.submitQuizAttempt(
        req.params.enrollmentId,
        req.params.quizId,
        req.user.id,
        req.body
      );
      return response.success(res, attempt, 'Quiz attempt submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all certificates for the authenticated student
   */
  async getCertificates(req, res, next) {
    try {
      const certificates = await studentService.getCertificates(req.user.id);
      return response.success(res, certificates, 'Certificates retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(req, res, next) {
    try {
      const certificate = await studentService.getCertificateById(
        req.params.id,
        req.user.id
      );
      return response.success(res, { certificate }, 'Certificate retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify certificate by verification code
   */
  async verifyCertificate(req, res, next) {
    try {
      const certificate = await studentService.verifyCertificate(req.params.code);
      return response.success(res, certificate, 'Certificate verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();

