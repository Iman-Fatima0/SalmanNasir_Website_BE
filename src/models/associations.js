/**
 * Define all model associations
 * This function should be called AFTER all models are initialized
 * @param {Object} models - Object containing all initialized models
 */
function defineAssociations(models) {
  const {
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
  } = models;

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

  // Course <-> CourseCategory (Many-to-Many)
  Course.belongsToMany(CourseCategory, {
    through: 'CourseCourseCategory',
    foreignKey: 'courseId',
    otherKey: 'categoryId',
    as: 'categories',
  });
  CourseCategory.belongsToMany(Course, {
    through: 'CourseCourseCategory',
    foreignKey: 'categoryId',
    otherKey: 'courseId',
    as: 'courses',
  });

  // CourseCategory <-> CourseCategory (Self-referencing for parent/child categories)
  CourseCategory.hasMany(CourseCategory, {
    as: 'subCategories',
    foreignKey: 'parentId',
    onDelete: 'SET NULL',
  });
  CourseCategory.belongsTo(CourseCategory, {
    as: 'parentCategory',
    foreignKey: 'parentId',
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

  // Lesson <-> Quiz (One-to-One)
  Lesson.hasOne(Quiz, {
    foreignKey: 'lessonId',
    as: 'quiz',
    onDelete: 'CASCADE',
  });
  Quiz.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson',
  });

  // Quiz <-> Question (One-to-Many)
  Quiz.hasMany(Question, {
    foreignKey: 'quizId',
    as: 'questions',
    onDelete: 'CASCADE',
  });
  Question.belongsTo(Quiz, {
    foreignKey: 'quizId',
    as: 'quiz',
  });

  // Question <-> Answer (One-to-Many)
  Question.hasMany(Answer, {
    foreignKey: 'questionId',
    as: 'answers',
    onDelete: 'CASCADE',
  });
  Answer.belongsTo(Question, {
    foreignKey: 'questionId',
    as: 'question',
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

  // CourseInstructor belongsTo relationships (for direct queries)
  CourseInstructor.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });
  CourseInstructor.belongsTo(Instructor, {
    foreignKey: 'instructorId',
    as: 'instructor',
  });
  Course.hasMany(CourseInstructor, {
    foreignKey: 'courseId',
    as: 'courseInstructors',
  });
  Instructor.hasMany(CourseInstructor, {
    foreignKey: 'instructorId',
    as: 'courseInstructors',
  });

  // User <-> Order (One-to-Many)
  User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'CASCADE',
  });
  Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Order <-> OrderItem (One-to-Many)
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });

  // OrderItem <-> Product (Many-to-One)
  OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });
  Product.hasMany(OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems',
  });

  // OrderItem <-> Course (Many-to-One, optional)
  OrderItem.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });
  Course.hasMany(OrderItem, {
    foreignKey: 'courseId',
    as: 'orderItems',
  });

  // Order <-> Payment (One-to-Many)
  Order.hasMany(Payment, {
    foreignKey: 'orderId',
    as: 'payments',
    onDelete: 'CASCADE',
  });
  Payment.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });

  // Payment <-> Refund (One-to-Many)
  Payment.hasMany(Refund, {
    foreignKey: 'paymentId',
    as: 'refunds',
    onDelete: 'CASCADE',
  });
  Refund.belongsTo(Payment, {
    foreignKey: 'paymentId',
    as: 'payment',
  });

  // User <-> Payment (One-to-Many)
  User.hasMany(Payment, {
    foreignKey: 'userId',
    as: 'payments',
    onDelete: 'CASCADE',
  });
  Payment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Refund <-> User (Many-to-One)
  Refund.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
  User.hasMany(Refund, {
    foreignKey: 'userId',
    as: 'refunds',
    onDelete: 'CASCADE',
  });

  // Refund <-> Order (Many-to-One)
  Refund.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });
  Order.hasMany(Refund, {
    foreignKey: 'orderId',
    as: 'refunds',
    onDelete: 'CASCADE',
  });

  // User <-> Session (One-to-Many)
  User.hasMany(Session, {
    foreignKey: 'userId',
    as: 'sessions',
    onDelete: 'CASCADE',
  });
  Session.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // User <-> Role (Many-to-Many through UserRole)
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles',
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users',
  });

  // Role <-> Permission (Many-to-Many through RolePermission)
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  });
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  });

  // User <-> Enrollment (One-to-Many)
  User.hasMany(Enrollment, {
    foreignKey: 'userId',
    as: 'enrollments',
    onDelete: 'CASCADE',
  });
  Enrollment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Course <-> Enrollment (One-to-Many)
  Course.hasMany(Enrollment, {
    foreignKey: 'courseId',
    as: 'enrollments',
    onDelete: 'CASCADE',
  });
  Enrollment.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });

  // Enrollment <-> Order (Many-to-One, optional)
  Enrollment.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });
  Order.hasMany(Enrollment, {
    foreignKey: 'orderId',
    as: 'enrollments',
    onDelete: 'SET NULL',
  });

  // Enrollment <-> LessonProgress (One-to-Many)
  Enrollment.hasMany(LessonProgress, {
    foreignKey: 'enrollmentId',
    as: 'lessonProgresses',
    onDelete: 'CASCADE',
  });
  LessonProgress.belongsTo(Enrollment, {
    foreignKey: 'enrollmentId',
    as: 'enrollment',
  });

  // LessonProgress <-> Lesson (Many-to-One)
  LessonProgress.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson',
  });
  Lesson.hasMany(LessonProgress, {
    foreignKey: 'lessonId',
    as: 'progresses',
  });

  // Enrollment <-> QuizAttempt (One-to-Many)
  Enrollment.hasMany(QuizAttempt, {
    foreignKey: 'enrollmentId',
    as: 'quizAttempts',
    onDelete: 'CASCADE',
  });
  QuizAttempt.belongsTo(Enrollment, {
    foreignKey: 'enrollmentId',
    as: 'enrollment',
  });

  // QuizAttempt <-> Quiz (Many-to-One)
  QuizAttempt.belongsTo(Quiz, {
    foreignKey: 'quizId',
    as: 'quiz',
  });
  Quiz.hasMany(QuizAttempt, {
    foreignKey: 'quizId',
    as: 'attempts',
  });

  // Enrollment <-> Certificate (One-to-One)
  Enrollment.hasOne(Certificate, {
    foreignKey: 'enrollmentId',
    as: 'certificate',
    onDelete: 'SET NULL', // If enrollment is deleted, certificate might still exist for verification
  });
  Certificate.belongsTo(Enrollment, {
    foreignKey: 'enrollmentId',
    as: 'enrollment',
  });

  // User <-> Certificate (One-to-Many)
  User.hasMany(Certificate, {
    foreignKey: 'userId',
    as: 'certificates',
    onDelete: 'CASCADE',
  });
  Certificate.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Course <-> Certificate (One-to-Many)
  Course.hasMany(Certificate, {
    foreignKey: 'courseId',
    as: 'certificates',
    onDelete: 'CASCADE',
  });
  Certificate.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });

  // User <-> Subscription (One-to-Many)
  User.hasMany(Subscription, {
    foreignKey: 'userId',
    as: 'subscriptions',
    onDelete: 'CASCADE',
  });
  Subscription.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Coupon <-> OrderItem (One-to-Many, via OrderItem)
  Coupon.hasMany(OrderItem, {
    foreignKey: 'couponId',
    as: 'orderItems',
    onDelete: 'SET NULL',
  });
  OrderItem.belongsTo(Coupon, {
    foreignKey: 'couponId',
    as: 'coupon',
  });

  // User <-> ActivityLog (One-to-Many)
  User.hasMany(ActivityLog, {
    foreignKey: 'userId',
    as: 'activityLogs',
    onDelete: 'CASCADE',
  });
  ActivityLog.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // User <-> AdminActionLog (One-to-Many, as admin)
  User.hasMany(AdminActionLog, {
    foreignKey: 'adminId',
    as: 'adminActionLogs',
    onDelete: 'CASCADE',
  });
  AdminActionLog.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin',
  });

  // User <-> EmailLog (One-to-Many, as recipient)
  User.hasMany(EmailLog, {
    foreignKey: 'recipientId',
    as: 'emailLogs',
    onDelete: 'SET NULL',
  });
  EmailLog.belongsTo(User, {
    foreignKey: 'recipientId',
    as: 'recipient',
  });

  // Product <-> Order (One-to-Many)
  Product.hasMany(Order, {
    foreignKey: 'productId',
    as: 'productOrders',
    onDelete: 'CASCADE',
  });
  Order.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });

  // Course <-> Order (One-to-Many)
  Course.hasMany(Order, {
    foreignKey: 'courseId',
    as: 'courseOrders',
    onDelete: 'SET NULL',
  });
  Order.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
  });
}

module.exports = defineAssociations;
