const {
  Course,
  Instructor,
  CourseInstructor,
  Enrollment,
  LessonProgress,
  QuizAttempt,
  User,
  Chapter,
  Lesson,
  Quiz,
} = require('../models/index');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { Op } = require('sequelize');

class InstructorService {
  /**
   * Get analytics overview for instructor
   */
  async getAnalyticsOverview(instructorId) {
    // Get all courses for this instructor
    const courseInstructors = await CourseInstructor.findAll({
      where: { instructorId },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    const courseIds = courseInstructors.map((ci) => ci.courseId);

    if (courseIds.length === 0) {
      return {
        totalCourses: 0,
        totalEnrollments: 0,
        totalStudents: 0,
        averageCompletionRate: 0,
        totalRevenue: 0,
      };
    }

    // Get enrollments for these courses
    const enrollments = await Enrollment.findAll({
      where: { courseId: { [Op.in]: courseIds } },
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

    // Calculate unique students
    const uniqueStudentIds = new Set(enrollments.map((e) => e.userId));
    const totalStudents = uniqueStudentIds.size;

    // Calculate completion rates
    let totalCompletion = 0;
    let completedEnrollments = 0;

    await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await this.calculateCourseProgress(enrollment.id, enrollment.courseId);
        totalCompletion += progress.completionPercentage;
        if (progress.completionPercentage >= 100) {
          completedEnrollments++;
        }
      })
    );

    const averageCompletionRate =
      enrollments.length > 0 ? (totalCompletion / enrollments.length).toFixed(2) : 0;

    // Calculate revenue (from orders)
    // Note: This is a simplified calculation. You may want to join with Order model
    const totalRevenue = 0; // TODO: Calculate from Order model

    return {
      totalCourses: courseIds.length,
      totalEnrollments: enrollments.length,
      totalStudents,
      averageCompletionRate: parseFloat(averageCompletionRate),
      completedEnrollments,
      totalRevenue,
    };
  }

  /**
   * Get analytics for a specific course
   */
  async getCourseAnalytics(courseId, instructorId) {
    // Verify instructor owns this course
    const courseInstructor = await CourseInstructor.findOne({
      where: { courseId, instructorId },
    });

    if (!courseInstructor) {
      throw new ForbiddenError('You do not have access to this course');
    }

    // Get course with details
    const course = await Course.findByPk(courseId, {
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
        },
      ],
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Get enrollments
    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    // Calculate detailed progress
    const progressDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await this.calculateCourseProgress(enrollment.id, courseId);
        return {
          enrollment: enrollment.toJSON(),
          progress,
        };
      })
    );

    // Calculate statistics
    const totalLessons = course.chapters?.reduce(
      (sum, chapter) => sum + (chapter.lessons?.length || 0),
      0
    ) || 0;

    const completedEnrollments = progressDetails.filter(
      (p) => p.progress.completionPercentage >= 100
    ).length;

    const averageCompletion =
      enrollments.length > 0
        ? (
            progressDetails.reduce((sum, p) => sum + p.progress.completionPercentage, 0) /
            enrollments.length
          ).toFixed(2)
        : 0;

    return {
      course: course.toJSON(),
      statistics: {
        totalEnrollments: enrollments.length,
        totalLessons,
        completedEnrollments,
        averageCompletion: parseFloat(averageCompletion),
      },
      enrollments: progressDetails,
    };
  }

  /**
   * Calculate progress for a course enrollment
   */
  async calculateCourseProgress(enrollmentId, courseId) {
    const course = await Course.findByPk(courseId, {
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
    });

    if (!course) {
      return { completionPercentage: 0, totalLessons: 0, completedLessons: 0 };
    }

    // Get all lesson IDs
    const allLessonIds = [];
    course.chapters?.forEach((chapter) => {
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

    return {
      totalLessons,
      completedLessons,
      completionPercentage: parseFloat(completionPercentage),
    };
  }

  /**
   * Get all courses for instructor
   */
  async getMyCourses(instructorId, options = {}) {
    const courseInstructors = await CourseInstructor.findAll({
      where: { instructorId },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Chapter,
              as: 'chapters',
            },
          ],
        },
      ],
    });

    const courses = courseInstructors.map((ci) => ci.course);

    return courses;
  }

  /**
   * Get course by ID (must be instructor's course)
   */
  async getCourseById(courseId, instructorId) {
    const courseInstructor = await CourseInstructor.findOne({
      where: { courseId, instructorId },
    });

    if (!courseInstructor) {
      throw new ForbiddenError('You do not have access to this course');
    }

    const course = await Course.findByPk(courseId, {
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
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return course;
  }

  /**
   * Update course (must be instructor's course)
   */
  async updateCourse(courseId, instructorId, updateData) {
    // Verify ownership
    const courseInstructor = await CourseInstructor.findOne({
      where: { courseId, instructorId },
    });

    if (!courseInstructor) {
      throw new ForbiddenError('You do not have access to this course');
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    await course.update(updateData);
    return course;
  }

  /**
   * Get all students enrolled in instructor's courses
   */
  async getStudents(instructorId, options = {}) {
    // Get all courses for this instructor
    const courseInstructors = await CourseInstructor.findAll({
      where: { instructorId },
    });

    const courseIds = courseInstructors.map((ci) => ci.courseId);

    if (courseIds.length === 0) {
      return [];
    }

    // Get enrollments
    const enrollments = await Enrollment.findAll({
      where: { courseId: { [Op.in]: courseIds } },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    // Group by user
    const studentsMap = new Map();
    enrollments.forEach((enrollment) => {
      const userId = enrollment.userId;
      if (!studentsMap.has(userId)) {
        studentsMap.set(userId, {
          user: enrollment.user.toJSON(),
          enrollments: [],
        });
      }
      studentsMap.get(userId).enrollments.push({
        id: enrollment.id,
        course: enrollment.course.toJSON(),
        status: enrollment.status,
        completionPercentage: enrollment.completionPercentage,
        enrolledAt: enrollment.enrolledAt,
      });
    });

    return Array.from(studentsMap.values());
  }

  /**
   * Get students enrolled in a specific course
   */
  async getCourseStudents(courseId, instructorId) {
    // Verify ownership
    const courseInstructor = await CourseInstructor.findOne({
      where: { courseId, instructorId },
    });

    if (!courseInstructor) {
      throw new ForbiddenError('You do not have access to this course');
    }

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Add progress for each enrollment
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await this.calculateCourseProgress(enrollment.id, courseId);
        return {
          enrollment: enrollment.toJSON(),
          progress,
        };
      })
    );

    return studentsWithProgress;
  }

  /**
   * Get student progress in a course
   */
  async getStudentProgress(courseId, studentId, instructorId) {
    // Verify ownership
    const courseInstructor = await CourseInstructor.findOne({
      where: { courseId, instructorId },
    });

    if (!courseInstructor) {
      throw new ForbiddenError('You do not have access to this course');
    }

    const enrollment = await Enrollment.findOne({
      where: { courseId, userId: studentId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
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
            },
          ],
        },
      ],
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    // Get lesson progress
    const lessonProgresses = await LessonProgress.findAll({
      where: { enrollmentId: enrollment.id },
    });

    // Get quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      where: { enrollmentId: enrollment.id },
      include: [
        {
          model: Quiz,
          as: 'quiz',
        },
      ],
    });

    const progress = await this.calculateCourseProgress(enrollment.id, courseId);

    return {
      enrollment: enrollment.toJSON(),
      progress,
      lessonProgresses: lessonProgresses.map((lp) => lp.toJSON()),
      quizAttempts: quizAttempts.map((qa) => qa.toJSON()),
    };
  }
}

module.exports = new InstructorService();
