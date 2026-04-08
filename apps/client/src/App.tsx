import { type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/common/navbar/Navbar';
import BottomNav from './components/common/navbar/BottomNav';
import ToastViewport from './components/Toast';
import Home from './pages/home';
import Category from './pages/Category';
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
    <div className="relative min-h-screen text-ink">
      {/* Premium Background Layer */}
      <div className="fixed inset-0 -z-10 bg-page">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-white opacity-100" />
        {/* Top intensity blue glow */}
        <div className="absolute top-0 h-[800px] w-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        {/* Accent glow for texture */}
        <div className="absolute -top-[10%] left-[10%] h-[40%] w-[80%] rounded-[100%] bg-primary/10 blur-[130px]" />
      </div>
      {!authPage ? <Navbar /> : null}
      <main className={authPage ? '' : 'pb-32 pt-20 md:pb-8 md:pt-24'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
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
