import { ADMIN_ROLE_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY, DEMO_USER_STORAGE_KEY } from './tokens';
import type { DemoRole } from './roles';

export const defaultDemoUser = {
  fullName: 'Alex Director',
  phone: '9876543210',
  email: 'alex@example.com',
  aadhaarNo: '123412341234',
  voterNo: 'ABCD1234567',
  facebook: '',
  instagram: '@alexdirector',
  youtube: '',
  userQrBase64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Camera-Rental-House-Alex-Director',
};

export type DemoUser = typeof defaultDemoUser;

export const readDemoUserSession = (): DemoUser | null => {
  const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const startDemoUserSession = () => {
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(defaultDemoUser));
  return defaultDemoUser;
};

export const updateDemoUserSession = (user: DemoUser) => {
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const clearDemoUserSession = () => {
  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
};

export const startDemoAdminSession = (role: DemoRole) => {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, `demo-${role}-token`);
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, role);
};

export const saveDemoAdminToken = (token: string, role: DemoRole) => {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, role);
};
