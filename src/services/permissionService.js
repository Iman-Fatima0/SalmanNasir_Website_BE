const { User, Role, Permission, UserRole, RolePermission } = require('../models/index');

/**
 * Permission Service
 * Handles RBAC (Role-Based Access Control) operations
 */
class PermissionService {
  /**
   * Get all roles and permissions for a user
   */
  async getUserRolesAndPermissions(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [
            {
              model: Permission,
              as: 'permissions',
            },
          ],
        },
      ],
    });

    if (!user) {
      return { roles: [], permissions: [] };
    }

    // Extract all unique permissions from all roles
    const permissionsSet = new Set();
    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissionsSet.add(permission.name);
      });
    });

    return {
      roles: user.roles?.map((r) => r.name) || [],
      permissions: Array.from(permissionsSet),
    };
  }

  /**
   * Check if user has a specific permission
   */
  async hasPermission(userId, permissionName) {
    const { permissions } = await this.getUserRolesAndPermissions(userId);
    return permissions.includes(permissionName);
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userId, permissionNames) {
    const { permissions } = await this.getUserRolesAndPermissions(userId);
    return permissionNames.some((perm) => permissions.includes(perm));
  }

  /**
   * Check if user has a specific role
   */
  async hasRole(userId, roleName) {
    const { roles } = await this.getUserRolesAndPermissions(userId);
    return roles.includes(roleName);
  }

  /**
   * Check if user has any of the specified roles
   */
  async hasAnyRole(userId, roleNames) {
    const { roles } = await this.getUserRolesAndPermissions(userId);
    return roleNames.some((role) => roles.includes(role));
  }

  /**
   * Assign role to user
   */
  async assignRole(userId, roleName) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error('Role not found');
    }

    // Check if already assigned
    const existing = await UserRole.findOne({
      where: { userId, roleId: role.id },
    });

    if (!existing) {
      await UserRole.create({ userId, roleId: role.id });
    }

    return true;
  }

  /**
   * Remove role from user
   */
  async removeRole(userId, roleName) {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error('Role not found');
    }

    await UserRole.destroy({
      where: { userId, roleId: role.id },
    });

    return true;
  }

  /**
   * Create permission
   */
  async createPermission(name, description = null) {
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: { description },
    });
    return permission;
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleName, permissionName) {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error('Role not found');
    }

    const permission = await Permission.findOne({ where: { name: permissionName } });
    if (!permission) {
      throw new Error('Permission not found');
    }

    const existing = await RolePermission.findOne({
      where: { roleId: role.id, permissionId: permission.id },
    });

    if (!existing) {
      await RolePermission.create({ roleId: role.id, permissionId: permission.id });
    }

    return true;
  }
}

module.exports = new PermissionService();

