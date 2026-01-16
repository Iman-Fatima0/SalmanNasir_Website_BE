const { AuthenticationError, ForbiddenError } = require('../utils/errors');

/**
 * Admin middleware
 * Checks if user is authenticated and is an admin
 * Note: Currently checks if email is admin@elcanadi.com
 * You can extend this to add a role field to User model
 */
const isAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    // Check if user is admin
    // Option 1: Check by email (current implementation)
    const isAdminUser = req.user.email === 'admin@elcanadi.com';

    // Option 2: If you add a role field to User model, use:
    // const isAdminUser = req.user.role === 'admin';

    if (!isAdminUser) {
      throw new ForbiddenError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAdmin,
};

