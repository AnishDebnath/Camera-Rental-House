export type DemoRole = 'admin' | 'manager';

export const DEMO_CREDENTIALS: Array<{
  label: string;
  username: string;
  password: string;
  role: DemoRole;
  description: string;
}> = [
  {
    label: 'Admin Demo',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    description: 'Full inventory, user, and dashboard access.',
  },
  {
    label: 'Manager Demo',
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    description: 'Counter-focused release, return, and rentals view.',
  },
];

export const getDemoRole = (): DemoRole =>
  (localStorage.getItem('cinekit_admin_role') as DemoRole) || 'admin';

export const startDemoSession = (role: DemoRole) => {
  localStorage.setItem('cinekit_admin_token', `demo-${role}-token`);
  localStorage.setItem('cinekit_admin_role', role);
};

export const clearDemoSession = () => {
  localStorage.removeItem('cinekit_admin_token');
  localStorage.removeItem('cinekit_admin_role');
};
