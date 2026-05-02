import { useEffect, useState, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Dashboard from './pages/Dashboard';
import Products from './pages/products';
import ProductForm from './pages/products/ProductForm';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Rentals from './pages/rentals';
import RentalHistory from './pages/rentals/History';
import ReleaseReturn from './pages/release';
import ProductionHouses from './pages/ProductionHouses';
import AdminBooking from './pages/AdminBooking';
import Staff from './pages/Staff';
import Accounts from './pages/Accounts';
import Sidebar from './components/common/Sidebar';
import AdminNavbar from './components/common/AdminNavbar';
import {
  ADMIN_ROLE_STORAGE_KEY,
  ADMIN_TOKEN_STORAGE_KEY,
  isValidRole,
  saveAuthSession,
} from '../../../packages/auth';
import { resolveAuthAppUrl } from '../../../packages/auth/appUrls';
import { useToast } from '@camera-rental-house/ui';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const ProtectedRoute = ({ children, allowedRoles = ['admin'] }: { children: any; allowedRoles?: string[] }) => {
  const location = useLocation();
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  const role = localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);

  if (!token) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  if (!allowedRoles.includes(role as string)) {
    // Staff can only access rentals and release
    return <Navigate to="/rentals" replace />;
  }

  return <>{children}</>;
};

const AUTH_PATHS = ['/login', '/auth-redirect'];

const AuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const toastShownRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const next = params.get('next');
    const welcome = params.get('welcome');

    if (welcome === 'true' && !toastShownRef.current) {
      toastShownRef.current = true;
      addToast({
        title: 'Welcome back',
        message: 'Logged in successfully to admin portal.',
        tone: 'success'
      });
    }

    if (token && isValidRole(role)) {
      saveAuthSession(token, role);
      // staff goes to /rentals, admin goes to /
      const defaultPath = role === 'staff' ? '/rentals' : '/';
      navigate(next?.startsWith('/') ? next : defaultPath, { replace: true });
      return;
    }

    const requestedPath = next?.startsWith('/') ? next : '/';
    const authUrl = `${authAppUrl}/login?next=${encodeURIComponent(requestedPath)}`;
    window.location.replace(authUrl);
  }, [location.search, navigate, addToast]);

  return <div className="admin-shell py-10 text-sm text-muted">Redirecting to login...</div>;
};

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen text-ink">
      <div className="flex min-h-screen flex-col">
        {!isAuthPage && (
          <>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
          </>
        )}
        <main className={clsx(
          'relative min-h-[calc(100vh-80px)]',
          isAuthPage ? '' : 'xl:pl-72'
        )}>
          <Routes>
            <Route path="/login" element={<AuthRedirect />} />
            <Route path="/auth-redirect" element={<AuthRedirect />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rentals"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Rentals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rentals/history"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <RentalHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/release"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <ReleaseReturn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/houses"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <ProductionHouses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-booking"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Accounts />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
