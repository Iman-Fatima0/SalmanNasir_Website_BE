const permissionService = require('../services/permissionService');
const { ForbiddenError } = require('../utils/errors');

/**
 * RBAC Middleware
 * Checks if user has required permissions or roles
 */

/**
 * Middleware to check if user has a specific permission
 * @param {string|string[]} requiredPermission - Permission name(s) required
 */
const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const permissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

      const hasPermission = await permissionService.hasAnyPermission(
        req.user.id,
        permissions
      );

      if (!hasPermission) {
        throw new ForbiddenError(
          `Access denied. Required permission: ${permissions.join(' or ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user has a specific role
 * @param {string|string[]} requiredRole - Role name(s) required
 */
const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      const hasRole = await permissionService.hasAnyRole(req.user.id, roles);

      if (!hasRole) {
        throw new ForbiddenError(
          `Access denied. Required role: ${roles.join(' or ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user owns the resource (for own/own: operations)
 * This is a helper that can be extended based on the resource type
 */
const requireOwnership = (resourceType, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const resourceId = req.params[resourceIdParam];
      let isOwner = false;

      // Check ownership based on resource type
      switch (resourceType) {
        case 'course':
          // Instructor owns course if they are assigned to it
          // Admin always has access
          const hasAdminRole = await permissionService.hasRole(req.user.id, 'ADMIN');
          if (hasAdminRole) {
            isOwner = true;
          } else {
            // Check if user is instructor for this course
            const { Course, CourseInstructor } = require('../models/index');
            const courseInstructor = await CourseInstructor.findOne({
              where: {
                courseId: resourceId,
                instructorId: req.user.id,
              },
            });
            isOwner = !!courseInstructor;
          }
          break;

        case 'enrollment':
          // User owns their own enrollment
          const { Enrollment } = require('../models/index');
          const enrollment = await Enrollment.findOne({
            where: { id: resourceId, userId: req.user.id },
          });
          isOwner = !!enrollment;
          break;

        case 'user':
          // User owns their own profile
          isOwner = req.user.id === resourceId;
          break;

        default:
          // For other resources, check if userId matches
          isOwner = req.user.id === resourceId;
      }

      if (!isOwner) {
        throw new ForbiddenError('Access denied. You do not own this resource.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Combined middleware: require permission OR ownership
 */
const requirePermissionOrOwnership = (requiredPermission, resourceType, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const permissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

      // Check permission first
      const hasPermission = await permissionService.hasAnyPermission(
        req.user.id,
        permissions
      );

      if (hasPermission) {
        return next();
      }

      // If no permission, check ownership
      const resourceId = req.params[resourceIdParam];
      let isOwner = false;

      switch (resourceType) {
        case 'course':
          const hasAdminRole = await permissionService.hasRole(req.user.id, 'ADMIN');
          if (hasAdminRole) {
            isOwner = true;
          } else {
            const { CourseInstructor } = require('../models/index');
            const courseInstructor = await CourseInstructor.findOne({
              where: {
                courseId: resourceId,
                instructorId: req.user.id,
              },
            });
            isOwner = !!courseInstructor;
          }
          break;

        case 'enrollment':
          const { Enrollment } = require('../models/index');
          const enrollment = await Enrollment.findOne({
            where: { id: resourceId, userId: req.user.id },
          });
          isOwner = !!enrollment;
          break;

        case 'user':
          isOwner = req.user.id === resourceId;
          break;

        default:
          isOwner = req.user.id === resourceId;
      }

      if (!isOwner) {
        throw new ForbiddenError(
          `Access denied. Required permission: ${permissions.join(' or ')} or ownership.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requirePermission,
  requireRole,
  requireOwnership,
  requirePermissionOrOwnership,
};

