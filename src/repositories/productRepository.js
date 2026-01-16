const { Product, Course } = require('../models/index');
const { Op } = require('sequelize');

class ProductRepository {
  /**
   * Create a new product
   */
  async create(productData) {
    return await Product.create({
      type: 'course',
      ...productData,
      slug: productData.slug || this.generateSlug(productData.title),
    });
  }

  /**
   * Find product by ID
   */
  async findById(id, includeCourses = false) {
    const include = [];
    
    if (includeCourses) {
      include.push({
        model: Course,
        as: 'courses',
        include: [
          {
            model: require('./../models/Chapter'),
            as: 'chapters',
            include: [
              {
                model: require('./../models/Lesson'),
                as: 'lessons',
                order: [['order', 'ASC']],
              },
            ],
            order: [['order', 'ASC']],
          },
          {
            model: require('./../models/Instructor'),
            as: 'instructors',
            through: { attributes: ['role'] },
          },
        ],
      });
    }

    return await Product.findByPk(id, {
      include,
    });
  }

  /**
   * Find all products with pagination
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      isPublished,
      includeCourses = false,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { subtitle: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
      where.isArchived = false;
    }

    const include = [];
    if (includeCourses) {
      include.push({
        model: Course,
        as: 'courses',
      });
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      products: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Update product
   */
  async update(id, updateData) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.update(updateData);
    return await product.reload();
  }

  /**
   * Delete product (soft delete)
   */
  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.isArchived = true;
    product.isPublished = false;
    await product.save();
    return true;
  }

  /**
   * Get all courses for a product
   */
  async getProductCourses(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Course,
          as: 'courses',
          include: [
            {
              model: require('./../models/Chapter'),
              as: 'chapters',
              include: [
                {
                  model: require('./../models/Lesson'),
                  as: 'lessons',
                  order: [['order', 'ASC']],
                },
              ],
              order: [['order', 'ASC']],
            },
            {
              model: require('./../models/Instructor'),
              as: 'instructors',
              through: { attributes: ['role'] },
            },
          ],
        },
      ],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product.courses || [];
  }

  /**
   * Helper: Generate slug from title
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

module.exports = new ProductRepository();

