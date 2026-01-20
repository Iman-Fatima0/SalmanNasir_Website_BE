const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

/**
 * Define User model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} User model
 */
function defineUser(sequelize) {
  // #region agent log
  try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'User.js:defineUser',message:'User model defining - sequelize check',data:{sequelizeType:typeof sequelize,sequelizeDefined:!!sequelize,sequelizeHasDefine:typeof sequelize?.define},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){/* Debug logging failed silently */}
  // #endregion

  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Nullable for OAuth users
        validate: {
          len: [8, 100],
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // OAuth providers
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      linkedinId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      appleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      // Profile image from OAuth
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Account status - production-ready enum
      status: {
        type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      // Legacy field for backward compatibility (deprecated - use status)
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Legacy role field (deprecated - use UserRole for RBAC)
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      // Soft delete support
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true, // Enable soft deletes
      indexes: [
        { fields: ['email'] },
        { fields: ['status'] },
        { fields: ['deletedAt'] },
        { fields: ['createdAt'] },
      ],
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
          // Sync isActive with status for backward compatibility
          if (user.status) {
            user.isActive = user.status === 'ACTIVE';
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 12);
          }
          // Sync isActive with status for backward compatibility
          if (user.changed('status')) {
            user.isActive = user.status === 'ACTIVE';
          }
        },
      },
    }
  );

  // #region agent log
  try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'User.js:afterDefine',message:'User model defined - checking User object',data:{userType:typeof User,userIsNull:User===null,userIsUndefined:User===undefined,hasHasMany:typeof User?.hasMany,userConstructor:User?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){/* Debug logging failed silently */}
  // #endregion

  // Instance method to compare password
  User.prototype.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Instance method to generate password reset token
  User.prototype.generatePasswordResetToken = function () {
    const crypto = require('node:crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
  };

  // Instance method to check if user has password (not OAuth only)
  User.prototype.hasPassword = function () {
    return !!this.password;
  };

  // #region agent log
  try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'User.js:export',message:'User model exporting - final check',data:{userType:typeof User,hasHasMany:typeof User?.hasMany,hasBelongsTo:typeof User?.belongsTo,userConstructor:User?.constructor?.name,isSequelizeModel:User?.constructor?.name==='Model'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){/* Debug logging failed silently */}
  // #endregion

  return User;
}

module.exports = defineUser;
