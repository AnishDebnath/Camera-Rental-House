import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { mockRentals } from '../data/mockProducts';
import { useToast } from './ToastContext';
import {
  clearDemoUserSession,
  defaultDemoUser,
  readDemoUserSession,
  startDemoUserSession,
  type DemoUser,
  updateDemoUserSession,
} from '../../../../packages/auth/useAuth';

type AuthContextValue = {
  user: DemoUser | null;
  isAuthenticated: boolean;
  rentals: typeof mockRentals;
  login: () => Promise<void>;
  signup: () => Promise<void>;
  updateProfile: (updates: Partial<DemoUser>) => Promise<void>;
  logout: () => void;
  refreshRentals: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(() => readDemoUserSession());
  const [rentals] = useState(mockRentals);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      rentals,
      login: async () => {
        setUser(startDemoUserSession());
        addToast({ title: 'Welcome back', message: 'Demo session started.', tone: 'success' });
      },
      signup: async () => {
        addToast({ title: 'Account created', message: 'Demo account saved locally.', tone: 'success' });
      },
      updateProfile: async (updates: Partial<DemoUser>) => {
        const next = { ...(user ?? defaultDemoUser), ...updates };
        setUser(updateDemoUserSession(next));
        addToast({ title: 'Profile updated', message: 'Saved in demo mode.', tone: 'success' });
      },
      logout: () => {
        clearDemoUserSession();
        setUser(null);
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
