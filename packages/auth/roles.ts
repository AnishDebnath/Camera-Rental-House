export type DemoRole = 'admin' | 'manager';

export const DEMO_ADMIN_CREDENTIALS = [
  {
    label: 'Admin Demo',
    identifiers: ['admin', 'admin@cinekit.com'],
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const,
    description: 'Full inventory, user, and dashboard access.',
  },
  {
    label: 'Manager Demo',
    identifiers: ['manager', 'manager@cinekit.com'],
    username: 'manager',
    password: 'manager123',
    role: 'manager' as const,
    description: 'Counter-focused release, return, and rentals view.',
  },
] as const;

export const isDemoRole = (value: string | null): value is DemoRole =>
  value === 'admin' || value === 'manager';

export const findDemoAdminAccount = (identifier: string, password: string) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  return DEMO_ADMIN_CREDENTIALS.find(
    (account) =>
      account.identifiers.some((candidate) => candidate === normalizedIdentifier) &&
      account.password === password,
  );
};
