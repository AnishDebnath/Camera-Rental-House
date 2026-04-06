import { ADMIN_ROLE_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY, DEMO_USER_STORAGE_KEY } from './tokens';
import { isDemoRole, type DemoRole } from './roles';

export const getDemoRole = (): DemoRole => {
  const storedRole =
    typeof localStorage === 'undefined' ? null : localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);

  return isDemoRole(storedRole) ? storedRole : 'admin';
};

export const hasDemoAdminSession = () => {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
};

export const hasDemoUserSession = () => {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem(DEMO_USER_STORAGE_KEY));
};

export const clearDemoAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY);
};
