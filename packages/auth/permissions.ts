import type { DemoRole } from './roles';

export const ROLE_PERMISSIONS: Record<DemoRole, readonly string[]> = {
  admin: ['dashboard:read', 'products:write', 'users:read', 'rentals:read', 'release:write'],
  manager: ['rentals:read', 'release:write'],
};

export const hasPermission = (role: DemoRole, permission: string) =>
  ROLE_PERMISSIONS[role].includes(permission);
