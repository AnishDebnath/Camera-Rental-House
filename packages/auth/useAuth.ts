import { ADMIN_ROLE_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY } from './tokens';
import type { AppRole } from './roles';

export const saveAuthSession = (token: string, role: AppRole) => {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, role);
};

export const clearAuthSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY);
  localStorage.removeItem('camera_rental_house_user');
  localStorage.removeItem('accessToken');
};
