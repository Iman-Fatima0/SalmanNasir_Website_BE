const {
  Enrollment,
  LessonProgress,
  QuizAttempt,
  Certificate,
  Course,
  Lesson,
  Quiz,
  Chapter,
  Question,
  Answer,
  User,
  Product,
  Order,
} = require('../models/index');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { Op } = require('sequelize');
const config = require('../config/env');

/** If url is a relative path, return absolute URL using backend base; otherwise return as-is. */
function toAbsoluteMediaUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = (config.BACKEND_URL || '').replace(/\/$/, '');
  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
}

class StudentService {
  /**
   * Manual checkout: create a pending order for a course with manual payment proof.
   * This does NOT create an enrollment. Enrollment is created only after admin approval.
   */
  async createManualOrder(userId, payload) {
    const { courseId, paymentProofUrl, transactionReference, notes } = payload;

    // Find course and product to determine amount & currency
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    if (!course || !course.product) {
      throw new NotFoundError('Course not found');
    }

    const product = course.product;

    // Create order with pending status (manual payment)
    const order = await Order.create({
      userId,
      productId: product.id,
      courseId: course.id,
      amount: product.price,
      currency: product.currency || 'USD',
      status: 'pending',
      paymentMethod: 'manual',
      transactionId: transactionReference || null,
      notes:
        notes ||
        (paymentProofUrl
          ? `Manual payment submitted. Proof: ${paymentProofUrl}${
              transactionReference ? `, Reference: ${transactionReference}` : ''
            }`
          : 'Manual payment submitted.'),
    });

    // Return a lightweight summary for the frontend
    return {
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      course: {
        id: course.id,
        title: product.title,
        subtitle: product.subtitle,
      },
    };
  }
  /**
   * Get all courses for a student (enrolled courses)
   */
  async getCourses(userId, options = {}) {
    try {
      // First, check if user exists and has any enrollments
      const enrollmentCount = await Enrollment.count({ where: { userId } });
      
      if (enrollmentCount === 0) {
        return {
          courses: [],
          total: 0,
        };
      }

      const enrollments = await Enrollment.findAll({
        where: { userId },
        include: [
          {
            model: Course,
            as: 'course',
            required: false,
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'subtitle', 'description', 'price', 'currency', 'isPublished'],
                required: false,
              },
              {
                model: Chapter,
                as: 'chapters',
                attributes: ['id', 'title', 'description', 'order'],
                required: false,
                include: [
                  {
                    model: Lesson,
                    as: 'lessons',
                    attributes: ['id', 'title', 'order', 'durationMinutes', 'isPreview'],
                    required: false,
                  },
                ],
                order: [['order', 'ASC']],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      // Calculate progress for each enrollment and format response
      const courses = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            // Skip if course is missing
            if (!enrollment.course) {
              console.warn(`Enrollment ${enrollment.id} has no associated course`);
              return null;
            }

            const progress = await this.calculateProgress(enrollment.id);
            const course = enrollment.course;
            
            return {
              ...course.toJSON(),
              enrollment: {
                id: enrollment.id,
                status: enrollment.status,
                enrolledAt: enrollment.createdAt,
                lastAccessedAt: enrollment.lastAccessedAt,
                completionPercentage: enrollment.completionPercentage,
              },
              progress,
            };
          } catch (error) {
            console.error(`Error processing enrollment ${enrollment.id}:`, error);
            // Return course without progress if calculation fails
            if (enrollment.course) {
              return {
                ...enrollment.course.toJSON(),
                enrollment: {
                  id: enrollment.id,
                  status: enrollment.status,
                  enrolledAt: enrollment.createdAt,
                  lastAccessedAt: enrollment.lastAccessedAt,
                  completionPercentage: enrollment.completionPercentage,
                },
                progress: {
                  totalLessons: 0,
                  completedLessons: 0,
                  completionPercentage: 0,
                  quizAttempts: 0,
                  passedQuizzes: 0,
                },
              };
            }
            return null;
          }
        })
      );

      // Filter out null values (enrollments with missing courses)
      const validCourses = courses.filter(course => course !== null);

    return {
      courses: validCourses,
      total: validCourses.length,
    };
  } catch (error) {
    console.error('Error in getCourses:', error);
    throw error;
  }
}

  /**
   * Get a single course by ID (must be enrolled)
   */
  async getCourseById(courseId, userId) {
    try {
      // Verify student is enrolled in this course
      const enrollment = await Enrollment.findOne({
        where: { userId, courseId },
        include: [
          {
            model: Course,
            as: 'course',
            required: false,
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'subtitle', 'description', 'price', 'currency', 'isPublished'],
                required: false,
              },
              {
                model: Chapter,
                as: 'chapters',
                attributes: ['id', 'title', 'description', 'order'],
                required: false,
                include: [
                  {
                    model: Lesson,
                    as: 'lessons',
                    attributes: ['id', 'title', 'description', 'order', 'durationMinutes', 'isPreview', 'type', 'videoUrl', 'audioUrl', 'contentUrl', 'textContent'],
                    required: false,
                  },
                ],
                order: [['order', 'ASC']],
              },
            ],
          },
        ],
      });

      if (!enrollment) {
        throw new NotFoundError('Course not found or you are not enrolled in this course');
      }

      if (!enrollment.course) {
        throw new NotFoundError('Course not found');
      }

      // Calculate progress
      const progress = await this.calculateProgress(enrollment.id);

      // Format response and ensure lesson media URLs are absolute (so frontend can load from another origin)
      const course = enrollment.course.toJSON();
      if (course.chapters && Array.isArray(course.chapters)) {
        course.chapters = course.chapters.map((ch) => {
          if (!ch.lessons || !Array.isArray(ch.lessons)) return ch;
          return {
            ...ch,
            lessons: ch.lessons.map((lesson) => ({
              ...lesson,
              videoUrl: lesson.videoUrl ? toAbsoluteMediaUrl(lesson.videoUrl) : lesson.videoUrl,
              audioUrl: lesson.audioUrl ? toAbsoluteMediaUrl(lesson.audioUrl) : lesson.audioUrl,
              contentUrl: lesson.contentUrl ? toAbsoluteMediaUrl(lesson.contentUrl) : lesson.contentUrl,
            })),
          };
        });
      }
      return {
        ...course,
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          enrolledAt: enrollment.createdAt,
          lastAccessedAt: enrollment.lastAccessedAt,
          completionPercentage: Number(enrollment.progressPercentage) ?? 0,
        },
        progress,
      };
    } catch (error) {
      console.error(`Error in getCourseById for course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Get all orders for a student (all purchase history)
   */
  async getOrders(userId, options = {}) {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:entry',message:'getOrders called',data:{userId,hasOptions:!!options},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:beforeQuery',message:'Before Order.findAll',data:{userId,OrderDefined:typeof Order,ProductDefined:typeof Product,CourseDefined:typeof Course},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'title', 'subtitle', 'description', 'price', 'currency', 'isPublished'],
            required: false,
          },
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'language', 'level', 'thumbnailUrl', 'durationMinutes', 'totalChapters', 'totalLessons'],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:afterQuery',message:'After Order.findAll',data:{ordersCount:orders?.length,firstOrderId:orders?.[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      // Return empty array if no orders
      if (!orders || orders.length === 0) {
        return [];
      }

      // Check for enrollments to see which orders are completed/approved
      const orderIds = orders.map(order => order.id);
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:beforeEnrollments',message:'Before Enrollment query',data:{orderIdsCount:orderIds.length,OpDefined:typeof Op},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      let enrollments = [];
      
      if (orderIds.length > 0) {
        enrollments = await Enrollment.findAll({
          where: {
            userId,
            orderId: { [Op.in]: orderIds },
          },
          attributes: ['id', 'orderId', 'status', 'progressPercentage'],
        });
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:afterEnrollments',message:'After Enrollment query',data:{enrollmentsCount:enrollments.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      // Create a map of orderId -> enrollment
      const enrollmentMap = {};
      enrollments.forEach(enrollment => {
        if (enrollment.orderId) {
          enrollmentMap[enrollment.orderId] = enrollment;
        }
      });

      // Format orders with enrollment info
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:beforeMap',message:'Before mapping orders',data:{ordersLength:orders.length,enrollmentMapKeys:Object.keys(enrollmentMap).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      const ordersWithEnrollment = orders.map((order, index) => {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:inMap',message:'Mapping order',data:{index,orderId:order.id,hasOrder:!!order},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        
        const orderData = order.toJSON();
        const enrollment = enrollmentMap[order.id];

        // Get course title from product if course is missing
        // If course exists, get title from course's product, otherwise from order's product
        let courseTitle = null;
        let courseSubtitle = null;
        
        if (orderData.course) {
          // If course exists, try to get product info from course
          // Note: Course has productId, so we'd need to load it separately if needed
          // For now, use product from order
          courseTitle = orderData.product?.title || null;
          courseSubtitle = orderData.product?.subtitle || null;
        } else {
          // If no course, use product info
          courseTitle = orderData.product?.title || null;
          courseSubtitle = orderData.product?.subtitle || null;
        }

        return {
          ...orderData,
          enrollment: enrollment ? {
            id: enrollment.id,
            status: enrollment.status,
            completionPercentage: enrollment.progressPercentage || 0,
          } : null,
          // Ensure course info is available (use product info as fallback)
          course: orderData.course || (orderData.product ? {
            id: null,
            title: courseTitle,
            subtitle: courseSubtitle,
            thumbnailUrl: null,
            language: null,
            level: null,
            durationMinutes: null,
            totalChapters: 0,
            totalLessons: 0,
          } : null),
        };
      });

      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:beforeReturn',message:'Before return',data:{ordersWithEnrollmentCount:ordersWithEnrollment.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      
      return ordersWithEnrollment;
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'studentService.js:getOrders:catch',message:'Error caught',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack?.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      
      console.error('Error in getOrders:', error);
      throw error;
    }
  }

  /**
   * Get all enrollments for a student
   */
  async getEnrollments(userId, options = {}) {
    try {
      // Check if user has any enrollments first
      const enrollmentCount = await Enrollment.count({ where: { userId } });
      
      if (enrollmentCount === 0) {
        return [];
      }

      const enrollments = await Enrollment.findAll({
        where: { userId },
        include: [
          {
            model: Course,
            as: 'course',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'subtitle', 'description', 'price', 'currency', 'isPublished'],
                required: false,
              },
              {
                model: Chapter,
                as: 'chapters',
                attributes: ['id', 'title', 'description', 'order'],
                include: [
                  {
                    model: Lesson,
                    as: 'lessons',
                    attributes: ['id', 'title', 'order', 'durationMinutes', 'isPreview'],
                  },
                ],
                order: [['order', 'ASC']],
                required: false,
              },
            ],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      // Calculate progress for each enrollment
      const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const progress = await this.calculateProgress(enrollment.id);
            return {
              ...enrollment.toJSON(),
              progress,
            };
          } catch (error) {
            console.error(`Error calculating progress for enrollment ${enrollment.id}:`, error);
            // Return enrollment without progress if calculation fails
            return {
              ...enrollment.toJSON(),
              progress: {
                totalLessons: 0,
                completedLessons: 0,
                completionPercentage: 0,
                quizAttempts: 0,
                passedQuizzes: 0,
              },
            };
          }
        })
      );

      return enrollmentsWithProgress;
    } catch (error) {
      console.error('Error in getEnrollments:', error);
      throw error;
    }
  }

  /**
   * Get enrollment by ID (must belong to student)
   */
  async getEnrollmentById(enrollmentId, userId) {
    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Chapter,
              as: 'chapters',
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                },
              ],
              order: [['order', 'ASC']],
            },
          ],
        },
      ],
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    const progress = await this.calculateProgress(enrollmentId);

    return {
      ...enrollment.toJSON(),
      progress,
    };
  }

  /**
   * Create enrollment
   */
  async createEnrollment(userId, courseId, orderId = null) {
    // Check if already enrolled
    const existing = await Enrollment.findOne({
      where: { userId, courseId },
    });

    if (existing) {
      throw new Error('Already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      orderId,
      status: 'enrolled',
    });

    return enrollment;
  }

  /**
   * Get progress for an enrollment
   */
  async getProgress(enrollmentId, userId) {
    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    return await this.calculateProgress(enrollmentId);
  }

  /**
   * Calculate progress for an enrollment
   */
  async calculateProgress(enrollmentId) {
    try {
      const enrollment = await Enrollment.findByPk(enrollmentId, {
        include: [
          {
            model: Course,
            as: 'course',
            required: false,
            include: [
              {
                model: Chapter,
                as: 'chapters',
                required: false,
                include: [
                  {
                    model: Lesson,
                    as: 'lessons',
                    attributes: ['id'],
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!enrollment) {
        throw new NotFoundError('Enrollment not found');
      }

      // Handle case where course is missing
      if (!enrollment.course) {
        return {
          totalLessons: 0,
          completedLessons: 0,
          completionPercentage: 0,
          quizAttempts: 0,
          passedQuizzes: 0,
        };
      }

      // Get all lesson IDs for this course
      const allLessonIds = [];
      if (enrollment.course.chapters && Array.isArray(enrollment.course.chapters)) {
        enrollment.course.chapters.forEach((chapter) => {
          if (chapter && chapter.lessons && Array.isArray(chapter.lessons)) {
            chapter.lessons.forEach((lesson) => {
              if (lesson && lesson.id) {
                allLessonIds.push(lesson.id);
              }
            });
          }
        });
      }

      // Get completed lessons (only if there are lessons)
      let completedProgresses = [];
      if (allLessonIds.length > 0) {
        completedProgresses = await LessonProgress.findAll({
          where: {
            enrollmentId,
            lessonId: { [Op.in]: allLessonIds },
            isCompleted: true,
          },
        });
      }

      const totalLessons = allLessonIds.length;
      const completedLessons = completedProgresses.length;
      const completionPercentage =
        totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(2) : 0;

      // Get quiz attempts
      const quizAttempts = await QuizAttempt.findAll({
        where: { enrollmentId },
        include: [
          {
            model: Quiz,
            as: 'quiz',
            required: false,
          },
        ],
      });

      return {
        totalLessons,
        completedLessons,
        completionPercentage: parseFloat(completionPercentage),
        quizAttempts: quizAttempts.length,
        passedQuizzes: quizAttempts.filter((a) => a.isPassed).length,
      };
    } catch (error) {
      console.error(`Error calculating progress for enrollment ${enrollmentId}:`, error);
      // Return default progress instead of throwing
      return {
        totalLessons: 0,
        completedLessons: 0,
        completionPercentage: 0,
        quizAttempts: 0,
        passedQuizzes: 0,
      };
    }
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(enrollmentId, lessonId, userId, updateData) {
    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    // Update or create lesson progress
    const [progress, created] = await LessonProgress.findOrCreate({
      where: { enrollmentId, lessonId },
      defaults: {
        enrollmentId,
        lessonId,
        isCompleted: updateData.isCompleted || false,
        timeSpentSeconds: updateData.timeSpentSeconds || 0,
      },
    });

    if (!created) {
      progress.isCompleted = updateData.isCompleted ?? progress.isCompleted;
      progress.timeSpentSeconds =
        updateData.timeSpentSeconds ?? progress.timeSpentSeconds;
      if (progress.isCompleted && !progress.completedAt) {
        progress.completedAt = new Date();
      }
      await progress.save();
    }

    // Update enrollment completion percentage
    const progressData = await this.calculateProgress(enrollmentId);
    enrollment.completionPercentage = progressData.completionPercentage;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    return progress;
  }

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(enrollmentId, quizId, userId, attemptData) {
    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    // Get quiz
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [
            {
              model: Answer,
              as: 'answers',
            },
          ],
        },
      ],
    });

    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const answers = attemptData.answers || {};

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer) {
        // Check if answer is correct
        const correctAnswer = question.answers.find((a) => a.isCorrect);
        if (correctAnswer && correctAnswer.id === userAnswer) {
          correctAnswers++;
        }
      }
    });

    const score = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
    const isPassed = parseFloat(score) >= quiz.passPercentage;

    // Get attempt number
    const previousAttempts = await QuizAttempt.count({
      where: { enrollmentId, quizId },
    });

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      enrollmentId,
      quizId,
      score: parseFloat(score),
      isPassed,
      attemptNumber: previousAttempts + 1,
      answers: answers,
      startedAt: attemptData.startedAt || new Date(),
      completedAt: new Date(),
    });

    return attempt;
  }

  /**
   * Get all certificates for a student
   */
  async getCertificates(userId) {
    const certificates = await Certificate.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'course',
        },
        {
          model: Enrollment,
          as: 'enrollment',
        },
      ],
      order: [['issueDate', 'DESC']],
    });

    return certificates;
  }

  /**
   * Get certificate by ID (must belong to student)
   */
  async getCertificateById(certificateId, userId) {
    const certificate = await Certificate.findOne({
      where: { id: certificateId, userId },
      include: [
        {
          model: Course,
          as: 'course',
        },
        {
          model: User,
          as: 'user',
        },
        {
          model: Enrollment,
          as: 'enrollment',
        },
      ],
    });

    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    return certificate;
  }

  /**
   * Verify certificate by verification code
   */
  async verifyCertificate(verificationCode) {
    const certificate = await Certificate.findOne({
      where: { verificationCode },
      include: [
        {
          model: Course,
          as: 'course',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    return certificate;
  }
}

module.exports = new StudentService();

