const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const emailService = require('./emailService');
const config = require('../config/env');

class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }

  /**
   * Register new user
   */
  async signup(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Normalize phone number (strip non-digits)
    const normalizedPhone = phone ? phone.replace(/\D/g, '') : null;

    // Create user
    const user = await userRepository.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone: normalizedPhone,
    });

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;

    return {
      user: userResponse,
      token,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user has password (not OAuth only)
    if (!user.hasPassword()) {
      throw new Error('Please sign in with your social account');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Update last login
    await userRepository.update(user.id, { lastLogin: new Date() });

    // Generate token
    const token = this.generateToken(user);

    // Remove sensitive data
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;

    return {
      user: userResponse,
      token,
    };
  }

  /**
   * OAuth login/signup
   */
  async oauthLogin(provider, profile) {
    const { id: providerId, email, firstName, lastName, profileImage } = profile;

    // Find user by OAuth ID
    let user = await userRepository.findByOAuthId(provider, providerId);

    if (!user) {
      // Check if user exists with this email
      if (email) {
        user = await userRepository.findByEmail(email);
        if (user) {
          // Link OAuth account to existing user
          const providerField = this.getProviderField(provider);
          await userRepository.update(user.id, {
            [providerField]: providerId,
            profileImage: profileImage || user.profileImage,
          });
          user = await userRepository.findById(user.id);
        }
      }

      // Create new user if doesn't exist
      if (!user) {
        user = await userRepository.create({
          email: email?.toLowerCase() || `${providerId}@${provider}.oauth`,
          firstName: firstName || 'User',
          lastName: lastName || '',
          profileImage,
          [this.getProviderField(provider)]: providerId,
          isEmailVerified: !!email, // Verified if email provided by OAuth
        });
      }
    } else {
      // Update last login and profile image
      await userRepository.update(user.id, {
        lastLogin: new Date(),
        profileImage: profileImage || user.profileImage,
      });
      user = await userRepository.findById(user.id);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove sensitive data
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;

    return {
      user: userResponse,
      token,
    };
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await userRepository.update(user.id, {
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires,
    });

    // Send reset email
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl, user.firstName);

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const user = await userRepository.findByPasswordResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    // Update password
    await userRepository.update(user.id, {
      password: newPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Generate new token
    const updatedUser = await userRepository.findById(user.id);
    const authToken = this.generateToken(updatedUser);

    const userResponse = updatedUser.toJSON();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;

    return {
      user: userResponse,
      token: authToken,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    // Only allow updating specific fields
    const allowedFields = ['firstName', 'lastName', 'phone', 'profileImage'];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        // Normalize phone number (strip non-digits) if it's the phone field
        if (field === 'phone' && updateData[field]) {
          filteredData[field] = updateData[field].replace(/\D/g, '');
        } else if (field === 'phone' && (updateData[field] === null || updateData[field] === '')) {
          filteredData[field] = null;
        } else {
          filteredData[field] = updateData[field];
        }
      }
    }

    if (Object.keys(filteredData).length === 0) {
      throw new Error('No valid fields to update');
    }

    // Update user
    const updatedUser = await userRepository.update(userId, filteredData);

    // Remove sensitive data
    const userResponse = updatedUser.toJSON();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;

    return userResponse;
  }

  /**
   * Get provider field name
   */
  getProviderField(provider) {
    const fieldMap = {
      google: 'googleId',
      facebook: 'facebookId',
      linkedin: 'linkedinId',
      apple: 'appleId',
    };
    return fieldMap[provider.toLowerCase()];
  }
}

module.exports = new AuthService();

