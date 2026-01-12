const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');
const { AuthenticationError } = require('../utils/errors');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user from database
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Invalid or expired token'));
    }
    next(error);
  }
};

module.exports = {
  authenticate,
};
