import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
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

const ProtectedRoute = ({ children, allowManager = false }) => {
  const token = localStorage.getItem('cinekit_admin_token');
  const role = localStorage.getItem('cinekit_admin_role');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowManager && role === 'manager') {
    return <Navigate to="/admin/rentals" replace />;
  }

  return children;
};

const adminPathsWithoutChrome = ['/admin/login'];

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hideChrome = useMemo(
    () => adminPathsWithoutChrome.includes(location.pathname),
    [location.pathname],
  );

  return (
    <div className="min-h-screen bg-page text-ink">
      {hideChrome ? null : (
        <>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
        </>
      )}
      <main className={hideChrome ? '' : 'lg:pl-72'}>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
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
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
