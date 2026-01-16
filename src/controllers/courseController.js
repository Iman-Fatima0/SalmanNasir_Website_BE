const courseService = require('../services/courseService');
const response = require('../utils/response');

class CourseController {
  /**
   * Create a new course
   */
  async create(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body);
      return response.success(res, course, 'Course created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all courses
   */
  async getAll(req, res, next) {
    try {
      const result = await courseService.getCourses(req.query);
      return response.success(res, result, 'Courses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course by ID
   */
  async getById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      return response.success(res, course, 'Course retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update course
   */
  async update(req, res, next) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      return response.success(res, course, 'Course updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete course
   */
  async delete(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      return response.success(res, null, 'Course deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();

