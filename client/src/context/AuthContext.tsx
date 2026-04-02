import { createContext, useContext, useMemo, useState } from 'react';
import { mockRentals } from '../data/mockProducts';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const defaultUser = {
  fullName: 'Alex Director',
  phone: '9876543210',
  email: 'alex@example.com',
  aadhaarNo: '123412341234',
  voterNo: 'ABCD1234567',
  facebook: '',
  instagram: '@alexdirector',
  youtube: '',
  userQrBase64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=CineKit-Alex-Director',
};

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cinekit_demo_user');
    return stored ? JSON.parse(stored) : defaultUser;
  });
  const [rentals] = useState(mockRentals);

  const value = useMemo(
    () => ({
      user,
      rentals,
      login: async () => {
        localStorage.setItem('cinekit_demo_user', JSON.stringify(defaultUser));
        setUser(defaultUser);
        addToast({ title: 'Welcome back', message: 'Demo session started.', tone: 'success' });
      },
      signup: async () => {
        addToast({ title: 'Account created', message: 'Demo account saved locally.', tone: 'success' });
      },
      updateProfile: async (updates) => {
        const next = { ...user, ...updates };
        localStorage.setItem('cinekit_demo_user', JSON.stringify(next));
        setUser(next);
        addToast({ title: 'Profile updated', message: 'Saved in demo mode.', tone: 'success' });
      },
      logout: () => {
        localStorage.removeItem('cinekit_demo_user');
        setUser(defaultUser);
        addToast({ title: 'Signed out', message: 'Demo state reset.', tone: 'info' });
      },
      refreshRentals: async () => {},
    }),
    [addToast, rentals, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
