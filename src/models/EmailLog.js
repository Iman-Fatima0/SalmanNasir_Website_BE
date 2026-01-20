const { DataTypes } = require('sequelize');

/**
 * Define EmailLog model - Email sending audit trail
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EmailLog model
 */
function defineEmailLog(sequelize) {
  const EmailLog = sequelize.define(
    'EmailLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recipientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User ID if recipient is a user',
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      template: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Email template used',
      },
      status: {
        type: DataTypes.ENUM('sent', 'failed', 'bounced', 'opened', 'clicked'),
        allowNull: false,
        defaultValue: 'sent',
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Email service provider (e.g., SendGrid, AWS SES)',
      },
      providerMessageId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Message ID from email provider',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional email metadata',
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When email was actually sent',
      },
      openedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      clickedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'email_logs',
      timestamps: true,
      paranoid: true, // For soft deletes
      indexes: [
        { fields: ['recipientEmail'] },
        { fields: ['recipientId'] },
        { fields: ['status'] },
        { fields: ['createdAt'] },
        { fields: ['providerMessageId'] },
      ],
    }
  );
  return EmailLog;
}

module.exports = defineEmailLog;

