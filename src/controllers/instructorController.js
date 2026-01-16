const instructorService = require('../services/instructorService');
const response = require('../utils/response');

class InstructorController {
  /**
   * Create a new instructor
   */
  async create(req, res, next) {
    try {
      const instructor = await instructorService.createInstructor(req.body);
      return response.success(res, instructor, 'Instructor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all instructors
   */
  async getAll(req, res, next) {
    try {
      const result = await instructorService.getInstructors(req.query);
      return response.success(res, result, 'Instructors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get instructor by ID
   */
  async getById(req, res, next) {
    try {
      const includeCourses = req.query.includeCourses === 'true';
      const instructor = await instructorService.getInstructorById(req.params.id, includeCourses);
      return response.success(res, instructor, 'Instructor retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update instructor
   */
  async update(req, res, next) {
    try {
      const instructor = await instructorService.updateInstructor(req.params.id, req.body);
      return response.success(res, instructor, 'Instructor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete instructor
   */
  async delete(req, res, next) {
    try {
      await instructorService.deleteInstructor(req.params.id);
      return response.success(res, null, 'Instructor deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstructorController();

