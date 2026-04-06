import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Rentals from './pages/Rentals';
import ReleaseReturn from './pages/ReleaseReturn';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';
import {
  ADMIN_TOKEN_STORAGE_KEY,
  isDemoRole,
  saveDemoAdminToken,
} from '../../../packages/auth';
import { resolveAuthAppUrl } from '../../../packages/auth/appUrls';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const ProtectedRoute = ({ children, allowManager = false }) => {
  const location = useLocation();
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  const role = localStorage.getItem('cinekit_admin_role');

  if (!token) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }
  if (!allowManager && role === 'manager') return <Navigate to="/rentals" replace />;

  return <>{children}</>;
};

const AUTH_PATHS = ['/login', '/auth-redirect'];

const AuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const next = params.get('next');

    if (token && isDemoRole(role)) {
      saveDemoAdminToken(token, role);
      navigate(next?.startsWith('/') ? next : role === 'manager' ? '/rentals' : '/', {
        replace: true,
      });
      return;
    }

    const requestedPath = next?.startsWith('/') ? next : '/';
    const authUrl = `${authAppUrl}/login?next=${encodeURIComponent(requestedPath)}`;
    window.location.replace(authUrl);
  }, [location.search, navigate]);

  return <div className="admin-shell py-10 text-sm text-muted">Redirecting to login...</div>;
};

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-page text-ink">
      {!isAuthPage && (
        <>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
        </>
      )}
      <main className={isAuthPage ? '' : 'lg:pl-72'}>
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
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <EditProduct />
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
              <ProtectedRoute allowManager>
                <Rentals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/release"
            element={
              <ProtectedRoute allowManager>
                <ReleaseReturn />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
