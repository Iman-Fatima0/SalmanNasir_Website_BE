const authService = require('../services/authService');
const response = require('../utils/response');

class AuthController {
  /**
   * User signup
   */
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      return response.success(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * User login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return response.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * OAuth callback handler
   */
  async oauthCallback(req, res, next) {
    try {
      const provider = req.provider || req.params.provider;
      const profile = req.user; // Set by passport strategy

      if (!profile) {
        const config = require('../config/env');
        return res.redirect(`${config.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
      }

      const result = await authService.oauthLogin(provider, profile);

      // Redirect to frontend with token
      const config = require('../config/env');
      const frontendUrl = config.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      const config = require('../config/env');
      const frontendUrl = config.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return response.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      return response.success(res, result, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  async getMe(req, res, next) {
    try {
      const user = req.user; // Set by auth middleware
      const userResponse = user.toJSON();
      delete userResponse.password;
      delete userResponse.passwordResetToken;
      delete userResponse.passwordResetExpires;
      
      return response.success(res, { user: userResponse }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

