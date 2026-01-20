const { Product, Course, Chapter, Lesson, Instructor, CourseInstructor } = require('../models/index');
const { Op } = require('sequelize');

class CourseRepository {
  /**
   * Create course with nested chapters and lessons
   */
  async create(courseData) {
    const transaction = await Course.sequelize.transaction();
    
    try {
      let product;

      // If productId is provided, use existing product
      if (courseData.productId) {
        product = await Product.findByPk(courseData.productId, { transaction });
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Optionally update product fields if provided
        if (courseData.title !== undefined) product.title = courseData.title;
        if (courseData.subtitle !== undefined) product.subtitle = courseData.subtitle;
        if (courseData.description !== undefined) product.description = courseData.description;
        if (courseData.price !== undefined) product.price = courseData.price;
        if (courseData.currency !== undefined) product.currency = courseData.currency;
        if (courseData.slug !== undefined) product.slug = courseData.slug;
        await product.save({ transaction });
      } else {
        // Create new product with unique slug
        const baseSlug = courseData.slug || this.generateSlug(courseData.title);
        const uniqueSlug = await this.generateUniqueSlug(baseSlug, transaction);

        product = await Product.create(
          {
            type: 'course',
            title: courseData.title,
            subtitle: courseData.subtitle,
            description: courseData.description,
            price: courseData.price,
            currency: courseData.currency || 'USD',
            slug: uniqueSlug,
          },
          { transaction }
        );
      }

      // Create course
      const course = await Course.create(
        {
          productId: product.id,
          language: courseData.language,
          level: courseData.level,
          thumbnailUrl: courseData.thumbnailUrl,
          totalChapters: courseData.chapters?.length || 0,
          totalLessons: this.countTotalLessons(courseData.chapters),
        },
        { transaction }
      );

      // Create chapters and lessons
      if (courseData.chapters && courseData.chapters.length > 0) {
        for (const chapterData of courseData.chapters) {
          const chapter = await Chapter.create(
            {
              courseId: course.id,
              title: chapterData.title,
              description: chapterData.description,
              order: chapterData.order,
            },
            { transaction }
          );

          if (chapterData.lessons && chapterData.lessons.length > 0) {
            for (const lessonData of chapterData.lessons) {
              await Lesson.create(
                {
                  chapterId: chapter.id,
                  title: lessonData.title,
                  description: lessonData.description,
                  order: lessonData.order,
                  type: lessonData.type || 'VIDEO',
                  videoUrl: lessonData.videoUrl || null,
                  audioUrl: lessonData.audioUrl || null,
                  contentUrl: lessonData.contentUrl || null,
                  textContent: lessonData.textContent || null,
                  durationMinutes: lessonData.durationMinutes || null,
                  isPreview: lessonData.isPreview || false,
                },
                { transaction }
              );
            }
          }
        }
      }

      // Assign instructors
      if (courseData.instructorIds && courseData.instructorIds.length > 0) {
        for (const instructorId of courseData.instructorIds) {
          await CourseInstructor.create(
            {
              courseId: course.id,
              instructorId: instructorId,
              role: courseData.instructorRole || 'primary',
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      // Return full course with relations
      return await this.findById(course.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Find course by ID with all relations
   */
  async findById(id) {
    return await Course.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: Chapter,
          as: 'chapters',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              order: [['order', 'ASC']],
            },
          ],
          order: [['order', 'ASC']],
        },
        {
          model: Instructor,
          as: 'instructors',
          through: { attributes: ['role'] },
        },
      ],
    });
  }

  /**
   * Find all courses with pagination and filters
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      level,
      language,
      isPublished,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { '$product.title$': { [Op.iLike]: `%${search}%` } },
        { '$product.subtitle$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (level) {
      where.level = level;
    }

    if (language) {
      where.language = language;
    }

    if (isPublished !== undefined) {
      where['$product.isPublished$'] = isPublished;
      where['$product.isArchived$'] = false;
    }

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          where: isPublished !== undefined ? { isArchived: false } : {},
        },
        {
          model: Instructor,
          as: 'instructors',
          through: { attributes: ['role'] },
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      courses: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Update course
   */
  async update(id, updateData) {
    const transaction = await Course.sequelize.transaction();

    try {
      const course = await Course.findByPk(id, { transaction });
      if (!course) {
        throw new Error('Course not found');
      }

      // Update course fields
      if (updateData.language !== undefined) course.language = updateData.language;
      if (updateData.level !== undefined) course.level = updateData.level;
      if (updateData.thumbnailUrl !== undefined) course.thumbnailUrl = updateData.thumbnailUrl;
      await course.save({ transaction });

      // Update product fields
      const product = await Product.findByPk(course.productId, { transaction });
      if (updateData.title !== undefined) product.title = updateData.title;
      if (updateData.subtitle !== undefined) product.subtitle = updateData.subtitle;
      if (updateData.description !== undefined) product.description = updateData.description;
      if (updateData.price !== undefined) product.price = updateData.price;
      if (updateData.currency !== undefined) product.currency = updateData.currency;
      if (updateData.isPublished !== undefined) product.isPublished = updateData.isPublished;
      await product.save({ transaction });

      // Update chapters and lessons if provided
      if (updateData.chapters) {
        // Delete existing chapters (cascade will delete lessons)
        await Chapter.destroy({ where: { courseId: id }, transaction });

        // Create new chapters
        for (const chapterData of updateData.chapters) {
          const chapter = await Chapter.create(
            {
              courseId: id,
              title: chapterData.title,
              description: chapterData.description,
              order: chapterData.order,
            },
            { transaction }
          );

          if (chapterData.lessons) {
            for (const lessonData of chapterData.lessons) {
              await Lesson.create(
                {
                  chapterId: chapter.id,
                  title: lessonData.title,
                  description: lessonData.description,
                  order: lessonData.order,
                  videoUrl: lessonData.videoUrl,
                  durationMinutes: lessonData.durationMinutes,
                  isPreview: lessonData.isPreview || false,
                },
                { transaction }
              );
            }
          }
        }

        // Update totals
        course.totalChapters = updateData.chapters.length;
        course.totalLessons = this.countTotalLessons(updateData.chapters);
        await course.save({ transaction });
      }

      // Update instructors if provided
      if (updateData.instructorIds) {
        await CourseInstructor.destroy({ where: { courseId: id }, transaction });
        for (const instructorId of updateData.instructorIds) {
          await CourseInstructor.create(
            {
              courseId: id,
              instructorId: instructorId,
              role: updateData.instructorRole || 'primary',
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      return await this.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete course
   * Note: This only deletes the course, not the product (products can have multiple courses)
   */
  async delete(id) {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new Error('Course not found');
    }

    // Delete the course (cascade will delete chapters and lessons)
    await course.destroy();

    return true;
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

  /**
   * Helper: Ensure slug is unique by appending -2, -3, ...
   * Uses the given transaction to avoid race conditions during create.
   */
  async generateUniqueSlug(baseSlug, transaction) {
    let slug = baseSlug || 'course';
    let suffix = 1;

    // Check if slug already exists
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Look for existing product with this slug
      // Use the transaction so the check is consistent within the create flow
      const existing = await Product.findOne({
        where: { slug },
        transaction,
      });

      if (!existing) {
        // Slug is free
        return slug;
      }

      // Slug taken, append / increment numeric suffix
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }
  }

  /**
   * Helper: Count total lessons in chapters
   */
  countTotalLessons(chapters) {
    if (!chapters) return 0;
    return chapters.reduce((total, chapter) => {
      return total + (chapter.lessons?.length || 0);
    }, 0);
  }
}

module.exports = new CourseRepository();

