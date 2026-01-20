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
   * Get all enrollments for a student
   */
  async getEnrollments(userId, options = {}) {
    const enrollments = await Enrollment.findAll({
      where: { userId },
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
                  attributes: ['id'],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await this.calculateProgress(enrollment.id);
        return {
          ...enrollment.toJSON(),
          progress,
        };
      })
    );

    return enrollmentsWithProgress;
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
    const enrollment = await Enrollment.findByPk(enrollmentId, {
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
                  attributes: ['id'],
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

    // Get all lesson IDs for this course
    const allLessonIds = [];
    enrollment.course.chapters?.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        allLessonIds.push(lesson.id);
      });
    });

    // Get completed lessons
    const completedProgresses = await LessonProgress.findAll({
      where: {
        enrollmentId,
        lessonId: { [Op.in]: allLessonIds },
        isCompleted: true,
      },
    });

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

