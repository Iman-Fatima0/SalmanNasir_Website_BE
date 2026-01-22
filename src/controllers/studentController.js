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
      console.error('Error in getCourses controller:', error);
      console.error('Error stack:', error.stack);
      next(error);
    }
  }

  /**
   * Get a single course by ID (must be enrolled)
   */
  async getCourseById(req, res, next) {
    try {
      const course = await studentService.getCourseById(req.params.id, req.user.id);
      return response.success(res, course, 'Course retrieved successfully');
    } catch (error) {
      console.error('Error in getCourseById controller:', error);
      console.error('Error stack:', error.stack);
      next(error);
    }
  }

  /**
   * Get all orders for the authenticated student (purchase history)
   */
  async getOrders(req, res, next) {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentController.js:getOrders:entry',message:'Controller getOrders called',data:{userId:req.user?.id,hasUser:!!req.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      // #endregion
      
      const orders = await studentService.getOrders(req.user.id, req.query);
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentController.js:getOrders:success',message:'Service returned successfully',data:{ordersIsArray:Array.isArray(orders),ordersLength:orders?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      
      return response.success(res, orders, 'Orders retrieved successfully');
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentController.js:getOrders:catch',message:'Controller error caught',data:{errorMessage:error.message,errorName:error.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'L'})}).catch(()=>{});
      // #endregion
      
      console.error('Error in getOrders controller:', error);
      console.error('Error stack:', error.stack);
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
      console.error('Error in getEnrollments controller:', error);
      console.error('Error stack:', error.stack);
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

