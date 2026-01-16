const courseRepository = require('../repositories/courseRepository');
const { NotFoundError } = require('../utils/errors');

class CourseService {
  /**
   * Create a new course
   */
  async createCourse(courseData) {
    return await courseRepository.create(courseData);
  }

  /**
   * Get course by ID
   */
  async getCourseById(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  /**
   * Get all courses with filters
   */
  async getCourses(options) {
    return await courseRepository.findAll(options);
  }

  /**
   * Update course
   */
  async updateCourse(id, updateData) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return await courseRepository.update(id, updateData);
  }

  /**
   * Delete course
   */
  async deleteCourse(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return await courseRepository.delete(id);
  }
}

module.exports = new CourseService();

