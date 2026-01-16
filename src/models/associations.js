const fs = require('fs');
const path = require('path');

/**
 * Define all model associations
 * This function should be called AFTER all models are initialized
 * @param {Object} models - Object containing all initialized models
 */
function defineAssociations(models) {
  const { Product, Course, Chapter, Lesson, Instructor, CourseInstructor, User, Order } = models;

  // #region agent log
  try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'associations.js:defineAssociations',message:'Associations defining - User model check',data:{userType:typeof User,userIsNull:User===null,userIsUndefined:User===undefined,hasHasMany:typeof User?.hasMany,userConstructor:User?.constructor?.name,userKeys:User?Object.keys(User).slice(0,10):'N/A'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){}
  // #endregion

  // Product <-> Course (One-to-Many)
  Product.hasMany(Course, {
    foreignKey: 'productId',
    as: 'courses',
    onDelete: 'CASCADE',
  });

  Course.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });

  // Course <-> Chapter (One-to-Many)
  Course.hasMany(Chapter, {
    foreignKey: 'courseId',
    as: 'chapters',
    onDelete: 'CASCADE',
  });

  Chapter.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });

  // Chapter <-> Lesson (One-to-Many)
  Chapter.hasMany(Lesson, {
    foreignKey: 'chapterId',
    as: 'lessons',
    onDelete: 'CASCADE',
  });

  Lesson.belongsTo(Chapter, {
    foreignKey: 'chapterId',
    as: 'chapter',
  });

  // Course <-> Instructor (Many-to-Many through CourseInstructor)
  Course.belongsToMany(Instructor, {
    through: CourseInstructor,
    foreignKey: 'courseId',
    otherKey: 'instructorId',
    as: 'instructors',
  });

  Instructor.belongsToMany(Course, {
    through: CourseInstructor,
    foreignKey: 'instructorId',
    otherKey: 'courseId',
    as: 'courses',
  });

  // User <-> Order (One-to-Many)
  // #region agent log
  try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'associations.js:beforeUserHasMany',message:'Before User.hasMany call',data:{userType:typeof User,hasHasMany:typeof User?.hasMany,userConstructor:User?.constructor?.name,orderType:typeof Order,orderConstructor:Order?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){}
  // #endregion
  User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'CASCADE',
  });

  Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Product <-> Order (One-to-Many)
  Product.hasMany(Order, {
    foreignKey: 'productId',
    as: 'orders',
    onDelete: 'CASCADE',
  });

  Order.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });

  // Course <-> Order (One-to-Many)
  Course.hasMany(Order, {
    foreignKey: 'courseId',
    as: 'orders',
    onDelete: 'SET NULL',
  });

  Order.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });

  // #region agent log
  try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'associations.js:afterAssociations',message:'All associations defined successfully',data:{allAssociationsDefined:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){}
  // #endregion
}

module.exports = defineAssociations;
