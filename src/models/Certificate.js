const { DataTypes } = require('sequelize');

/**
 * Define Certificate model - Course completion certificates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certificate model
 */
function defineCertificate(sequelize) {
  const Certificate = sequelize.define(
    'Certificate',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      enrollmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique code for certificate verification (e.g., CERT-ABC123)',
      },
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      certificateUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to generated certificate PDF/image',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional certificate data (issue date, course name, etc.)',
      },
    },
    {
      tableName: 'certificates',
      timestamps: true,
      indexes: [
        { fields: ['enrollmentId'], unique: true },
        { fields: ['userId'] },
        { fields: ['courseId'] },
        { fields: ['verificationCode'], unique: true },
      ],
    }
  );

  return Certificate;
}

module.exports = defineCertificate;

