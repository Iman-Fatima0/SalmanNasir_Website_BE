const { AuthenticationError, ForbiddenError } = require('../utils/errors');
const permissionService = require('../services/permissionService');

/**
 * Admin middleware
 * Checks if user is authenticated and has ADMIN role
 * Falls back to email check for backward compatibility
 */
const isAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    // Check if user has ADMIN role using RBAC
    const hasAdminRole = await permissionService.hasRole(req.user.id, 'ADMIN');

    // Fallback to email check for backward compatibility
    const isAdminEmail = req.user.email === 'admin@elcanadi.com';

    if (!hasAdminRole && !isAdminEmail) {
      throw new ForbiddenError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Instructor middleware
 * Checks if user is authenticated and has INSTRUCTOR role
 */
const isInstructor = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const hasInstructorRole = await permissionService.hasRole(req.user.id, 'INSTRUCTOR');
    const hasAdminRole = await permissionService.hasRole(req.user.id, 'ADMIN');

    // Admin can access instructor endpoints
    if (!hasInstructorRole && !hasAdminRole) {
      throw new ForbiddenError('Instructor access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Student middleware
 * Checks if user is authenticated (any authenticated user is a student)
 */
const isStudent = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    // Any authenticated user can access student endpoints
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAdmin,
  isInstructor,
  isStudent,
};

