const instructorRepository = require('../repositories/instructorRepository');
const { NotFoundError } = require('../utils/errors');

class InstructorService {
  /**
   * Create a new instructor
   */
  async createInstructor(instructorData) {
    return await instructorRepository.create(instructorData);
  }

  /**
   * Get instructor by ID
   */
  async getInstructorById(id, includeCourses = false) {
    const instructor = await instructorRepository.findById(id, includeCourses);
    if (!instructor) {
      throw new NotFoundError('Instructor not found');
    }
    return instructor;
  }

  /**
   * Get all instructors with filters
   */
  async getInstructors(options) {
    return await instructorRepository.findAll(options);
  }

  /**
   * Update instructor
   */
  async updateInstructor(id, updateData) {
    const instructor = await instructorRepository.findById(id);
    if (!instructor) {
      throw new NotFoundError('Instructor not found');
    }
    return await instructorRepository.update(id, updateData);
  }

  /**
   * Delete instructor
   */
  async deleteInstructor(id) {
    const instructor = await instructorRepository.findById(id);
    if (!instructor) {
      throw new NotFoundError('Instructor not found');
    }
    return await instructorRepository.delete(id);
  }
}

module.exports = new InstructorService();

