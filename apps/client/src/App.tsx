import { type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ToastViewport from './components/Toast';
import Landing from './pages/Landing';
import Browse from './pages/Browse';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favourites from './pages/Favourites';
import Account from './pages/Account';
import { useAuth } from './store/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const authPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-page text-ink">
      {!authPage ? <Navbar /> : null}
      <main className={authPage ? '' : 'pb-24 pt-20 md:pb-8 md:pt-24'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      {!authPage ? <BottomNav /> : null}
      <ToastViewport />
    </div>
  );
}

export default App;
