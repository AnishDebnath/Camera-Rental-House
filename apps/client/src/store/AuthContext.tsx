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
  aadhaarDocUrl?: string;
  voterNo?: string;
  voterDocUrl?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  createdAt?: string;
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
  refreshUser: () => Promise<void>;
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
          const { user: data } = response.data;
          setUser({
            ...data,
            avatarUrl: data.avatarUrl,
            userQrBase64: data.userQrBase64,
            aadhaarDocUrl: data.aadhaarDocUrl,
            voterDocUrl: data.voterDocUrl,
            createdAt: data.createdAt,
          });
          localStorage.setItem('accessToken', response.data.accessToken);
          addToast({ title: 'Account created', message: 'Registration complete.', tone: 'success' });
        } catch (error: any) {
          throw error;
        }
      },
      updateProfile: async (updates: any) => {
        try {
          const hasFiles = updates.aadhaarDoc instanceof File || updates.voterDoc instanceof File || updates.selfie instanceof File;
          let payload: any = updates;

          if (hasFiles) {
            const formData = new FormData();
            Object.entries(updates).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                formData.append(key, value as any);
              }
            });
            payload = formData;
          }

          const response = await axiosInstance.patch('/auth/update-profile', payload, {
            headers: hasFiles ? { 'Content-Type': 'multipart/form-data' } : undefined,
          });

          const { user: updatedUser } = response.data;
          setUser(updatedUser);
          addToast({ title: 'Profile updated', message: 'Your changes were saved successfully.', tone: 'success' });
        } catch (error: any) {
          console.error('Update Profile Error:', error);
          throw error;
        }
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        addToast({ title: 'Signed out', message: 'You have been logged out.', tone: 'info' });
      },
      refreshRentals: async () => {
        // Fetch real rentals here
      },
      refreshUser: async () => {
        try {
          const response = await axiosInstance.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
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
