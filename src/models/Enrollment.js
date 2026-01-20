const { DataTypes } = require('sequelize');

/**
 * Define Enrollment model - Student course enrollment
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Enrollment model
 */
function defineEnrollment(sequelize) {
  const Enrollment = sequelize.define(
    'Enrollment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Null if free course or subscription',
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      enrolledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      progressPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastAccessedLessonId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: 'enrollments',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'courseId'],
          where: { status: 'ACTIVE' },
        },
        { fields: ['userId'] },
        { fields: ['courseId'] },
        { fields: ['orderId'] },
        { fields: ['status'] },
      ],
    }
  );

  return Enrollment;
}

module.exports = defineEnrollment;

