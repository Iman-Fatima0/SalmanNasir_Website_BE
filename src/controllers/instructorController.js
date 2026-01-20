const instructorService = require('../services/instructorService');
const response = require('../utils/response');

class InstructorController {
  /**
   * Get analytics overview for instructor
   */
  async getAnalyticsOverview(req, res, next) {
    try {
      const analytics = await instructorService.getAnalyticsOverview(req.user.id);
      return response.success(res, analytics, 'Analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get analytics for a specific course
   */
  async getCourseAnalytics(req, res, next) {
    try {
      const analytics = await instructorService.getCourseAnalytics(
        req.params.courseId,
        req.user.id
      );
      return response.success(res, analytics, 'Course analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all courses for instructor
   */
  async getMyCourses(req, res, next) {
    try {
      const courses = await instructorService.getMyCourses(req.user.id, req.query);
      return response.success(res, courses, 'Courses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course by ID (must be instructor's course)
   */
  async getCourseById(req, res, next) {
    try {
      const course = await instructorService.getCourseById(req.params.id, req.user.id);
      return response.success(res, { course }, 'Course retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update course (must be instructor's course)
   */
  async updateCourse(req, res, next) {
    try {
      const course = await instructorService.updateCourse(
        req.params.id,
        req.user.id,
        req.body
      );
      return response.success(res, course, 'Course updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all students enrolled in instructor's courses
   */
  async getStudents(req, res, next) {
    try {
      const students = await instructorService.getStudents(req.user.id, req.query);
      return response.success(res, students, 'Students retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get students enrolled in a specific course
   */
  async getCourseStudents(req, res, next) {
    try {
      const students = await instructorService.getCourseStudents(
        req.params.courseId,
        req.user.id
      );
      return response.success(res, students, 'Course students retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student progress in a course
   */
  async getStudentProgress(req, res, next) {
    try {
      const progress = await instructorService.getStudentProgress(
        req.params.courseId,
        req.params.studentId,
        req.user.id
      );
      return response.success(res, progress, 'Student progress retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstructorController();
