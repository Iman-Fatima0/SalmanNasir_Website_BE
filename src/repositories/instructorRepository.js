const { Instructor, Course, CourseInstructor, Product } = require('../models/index');
const { Op } = require('sequelize');

class InstructorRepository {
  /**
   * Create instructor
   */
  async create(instructorData) {
    return await Instructor.create(instructorData);
  }

  /**
   * Find instructor by ID
   */
  async findById(id, includeCourses = false) {
    const include = [];
    
    if (includeCourses) {
      include.push({
        model: Course,
        as: 'courses',
        through: { attributes: ['role'] },
        include: [
          {
            model: Product,
            as: 'product',
          },
        ],
      });
    }

    return await Instructor.findByPk(id, {
      include,
    });
  }

  /**
   * Find all instructors with pagination
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await Instructor.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      instructors: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Update instructor
   */
  async update(id, updateData) {
    const instructor = await Instructor.findByPk(id);
    if (!instructor) {
      throw new Error('Instructor not found');
    }

    await instructor.update(updateData);
    return await instructor.reload();
  }

  /**
   * Delete instructor (soft delete)
   */
  async delete(id) {
    const instructor = await Instructor.findByPk(id);
    if (!instructor) {
      throw new Error('Instructor not found');
    }

    instructor.isActive = false;
    await instructor.save();
    return true;
  }
}

module.exports = new InstructorRepository();

