const { User } = require('../models/index');
const { Op } = require('sequelize');

class UserRepository {
  /**
   * Create a new user
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({ where: { email: email.toLowerCase() } });
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    return await User.findByPk(id);
  }

  /**
   * Find user by OAuth provider ID
   */
  async findByOAuthId(provider, providerId) {
    const fieldMap = {
      google: 'googleId',
      facebook: 'facebookId',
      linkedin: 'linkedinId',
      apple: 'appleId',
    };

    const field = fieldMap[provider.toLowerCase()];
    if (!field) {
      throw new Error(`Invalid OAuth provider: ${provider}`);
    }

    return await User.findOne({ where: { [field]: providerId } });
  }

  /**
   * Find or create user by email
   */
  async findOrCreateByEmail(email, defaults = {}) {
    return await User.findOrCreate({
      where: { email: email.toLowerCase() },
      defaults,
    });
  }

  /**
   * Update user
   */
  async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updateData);
    return user.reload();
  }

  /**
   * Update user by email
   */
  async updateByEmail(email, updateData) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updateData);
    return user.reload();
  }

  /**
   * Find user by password reset token
   */
  async findByPasswordResetToken(token) {
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });
  }

  /**
   * Delete user
   */
  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return true;
  }
}

module.exports = new UserRepository();

