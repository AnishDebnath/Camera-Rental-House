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
import Login from './pages/Login';
import { isDemoRole, startDemoSession } from './utils/demoAuth';
import { authAppUrl, useExternalAuthApp } from './utils/appUrls';

const ProtectedRoute = ({ children, allowManager = false }) => {
  const location = useLocation();
  const token = localStorage.getItem('cinekit_admin_token');
  const role = localStorage.getItem('cinekit_admin_role');

  if (!token) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }
  if (!allowManager && role === 'manager') return <Navigate to="/admin/rentals" replace />;

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
      localStorage.setItem('cinekit_admin_token', token);
      startDemoSession(role);
      navigate(next && next.startsWith('/admin') ? next : role === 'manager' ? '/admin/rentals' : '/admin', {
        replace: true,
      });
      return;
    }

    if (!useExternalAuthApp) {
      navigate(`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`, { replace: true });
      return;
    }

    const requestedPath = next && next.startsWith('/admin') ? next : '/admin';
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
          <Route path="/login" element={useExternalAuthApp ? <AuthRedirect /> : <Login />} />
          <Route path="/auth-redirect" element={<AuthRedirect />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rentals"
            element={
              <ProtectedRoute allowManager>
                <Rentals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/release"
            element={
              <ProtectedRoute allowManager>
                <ReleaseReturn />
              </ProtectedRoute>
            }
          />
          {/* Redirect root and unknown paths to admin dashboard (which triggers ProtectedRoute) */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
