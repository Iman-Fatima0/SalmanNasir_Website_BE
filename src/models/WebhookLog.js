const { DataTypes } = require('sequelize');

/**
 * Define WebhookLog model - Webhook event audit trail
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookLog model
 */
function defineWebhookLog(sequelize) {
  const WebhookLog = sequelize.define(
    'WebhookLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Webhook event type (e.g., order.completed, payment.succeeded)',
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Webhook payload data',
      },
      headers: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'HTTP headers received',
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Webhook endpoint URL',
      },
      status: {
        type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'retrying'),
        allowNull: false,
        defaultValue: 'pending',
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'HTTP status code from webhook endpoint',
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Response body from webhook endpoint',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'webhook_logs',
      timestamps: true,
      paranoid: true, // For soft deletes
      indexes: [
        { fields: ['eventType'] },
        { fields: ['status'] },
        { fields: ['url'] },
        { fields: ['createdAt'] },
      ],
    }
  );
  return WebhookLog;
}

module.exports = defineWebhookLog;

