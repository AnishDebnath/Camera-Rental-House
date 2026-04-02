import { Route, Routes, useLocation } from 'react-router-dom';
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
import Login from './pages/Login';
import Signup from './pages/Signup';

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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/account" element={<Account />} />
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
