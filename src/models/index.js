/**
 * Central model loader
 * Initializes all models and defines associations
 * This eliminates circular dependencies by:
 * 1. Creating sequelize instance first
 * 2. Initializing all models with sequelize
 * 3. Defining associations after all models are initialized
 */

const sequelize = require('../config/database');

// Import model definition functions
const defineUser = require('./User');
const defineProduct = require('./Product');
const defineCourse = require('./Course');
const defineChapter = require('./Chapter');
const defineLesson = require('./Lesson');
const defineInstructor = require('./Instructor');
const defineCourseInstructor = require('./CourseInstructor');
const defineOrder = require('./Order');
const defineRole = require('./Role');
const definePermission = require('./Permission');
const defineRolePermission = require('./RolePermission');
const defineUserRole = require('./UserRole');
const defineSession = require('./Session');
const defineCourseCategory = require('./CourseCategory');
const defineQuiz = require('./Quiz');
const defineQuestion = require('./Question');
const defineAnswer = require('./Answer');
const defineEnrollment = require('./Enrollment');
const defineLessonProgress = require('./LessonProgress');
const defineQuizAttempt = require('./QuizAttempt');
const defineCertificate = require('./Certificate');
const definePayment = require('./Payment');
const defineRefund = require('./Refund');
const defineSubscription = require('./Subscription');
const defineCoupon = require('./Coupon');
const defineOrderItem = require('./OrderItem');
const defineActivityLog = require('./ActivityLog');
const defineAdminActionLog = require('./AdminActionLog');
const defineEmailLog = require('./EmailLog');
const defineWebhookLog = require('./WebhookLog');
const defineAssociations = require('./associations');

// Initialize all models
const User = defineUser(sequelize);
const Product = defineProduct(sequelize);
const Course = defineCourse(sequelize);
const Chapter = defineChapter(sequelize);
const Lesson = defineLesson(sequelize);
const Instructor = defineInstructor(sequelize);
const CourseInstructor = defineCourseInstructor(sequelize);
const Order = defineOrder(sequelize);
const Role = defineRole(sequelize);
const Permission = definePermission(sequelize);
const RolePermission = defineRolePermission(sequelize);
const UserRole = defineUserRole(sequelize);
const Session = defineSession(sequelize);
const CourseCategory = defineCourseCategory(sequelize);
const Quiz = defineQuiz(sequelize);
const Question = defineQuestion(sequelize);
const Answer = defineAnswer(sequelize);
const Enrollment = defineEnrollment(sequelize);
const LessonProgress = defineLessonProgress(sequelize);
const QuizAttempt = defineQuizAttempt(sequelize);
const Certificate = defineCertificate(sequelize);
const Payment = definePayment(sequelize);
const Refund = defineRefund(sequelize);
const Subscription = defineSubscription(sequelize);
const Coupon = defineCoupon(sequelize);
const OrderItem = defineOrderItem(sequelize);
const ActivityLog = defineActivityLog(sequelize);
const AdminActionLog = defineAdminActionLog(sequelize);
const EmailLog = defineEmailLog(sequelize);
const WebhookLog = defineWebhookLog(sequelize);

// Define associations after all models are initialized
defineAssociations({
  Product,
  Course,
  Chapter,
  Lesson,
  Instructor,
  CourseInstructor,
  User,
  Order,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Session,
  CourseCategory,
  Quiz,
  Question,
  Answer,
  Enrollment,
  LessonProgress,
  QuizAttempt,
  Certificate,
  Payment,
  Refund,
  Subscription,
  Coupon,
  OrderItem,
  ActivityLog,
  AdminActionLog,
  EmailLog,
  WebhookLog,
});

// Export all models
module.exports = {
  sequelize,
  User,
  Product,
  Course,
  Chapter,
  Lesson,
  Instructor,
  CourseInstructor,
  Order,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Session,
  CourseCategory,
  Quiz,
  Question,
  Answer,
  Enrollment,
  LessonProgress,
  QuizAttempt,
  Certificate,
  Payment,
  Refund,
  Subscription,
  Coupon,
  OrderItem,
  ActivityLog,
  AdminActionLog,
  EmailLog,
  WebhookLog,
};

