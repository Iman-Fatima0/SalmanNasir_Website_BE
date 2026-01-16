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
};

