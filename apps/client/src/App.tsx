import { type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/common/navbar/Navbar';
import BottomNav from './components/common/navbar/BottomNav';
import ToastViewport from './components/Toast';
import Home from './pages/home';
import Category from './pages/category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favourites from './pages/Favourites';
import Account from './pages/account';
import { useAuth } from './store/AuthContext';
import PageTransition from './components/feature/PageTransition';

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
      <main className={authPage ? '' : 'pb-10 pt-20 md:pt-24'}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/category" element={<PageTransition><Category /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/checkout" element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
            <Route path="/favourites" element={<PageTransition><Favourites /></PageTransition>} />
            <Route path="/account" element={<ProtectedRoute><PageTransition><Account /></PageTransition></ProtectedRoute>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!authPage ? <BottomNav /> : null}
      <ToastViewport />
    </div>
  );
}

export default App;
