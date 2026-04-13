import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import axiosInstance from '../api/axiosInstance';
import { useToast } from './ToastContext';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  userQrBase64?: string;
  aadhaarNo?: string;
  voterNo?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  rentals: any[];
  login: (credentials: any) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
  refreshRentals: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('camera_rental_house_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [rentals, setRentals] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('camera_rental_house_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('camera_rental_house_user');
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      rentals,
      login: async (credentials: any) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        setUser(response.data.user);
        localStorage.setItem('accessToken', response.data.accessToken);
        addToast({ title: 'Welcome back', message: 'Logged in successfully.', tone: 'success' });
      },
      signup: async (formData: FormData) => {
        try {
          const response = await axiosInstance.post('/auth/signup', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setUser(response.data.user);
          localStorage.setItem('accessToken', response.data.accessToken);
          addToast({ title: 'Account created', message: 'Registration complete.', tone: 'success' });
        } catch (error: any) {
          throw error;
        }
      },
      updateProfile: async (updates: Partial<User>) => {
        // Mocking for now, could be an API call
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
        addToast({ title: 'Profile updated', message: 'Your changes were saved.', tone: 'success' });
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        addToast({ title: 'Signed out', message: 'You have been logged out.', tone: 'info' });
      },
      refreshRentals: async () => {
        // Fetch real rentals here
      },
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
