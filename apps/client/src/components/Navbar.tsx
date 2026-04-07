import { useState, useEffect } from 'react';
import { Camera, Search, ShoppingBag, User, ChevronDown, LogOut, Package, Heart, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { useFavourites } from '../store/FavouritesContext';
import clsx from 'clsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { favourites } = useFavourites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Typing animation for placeholder
  const placeholderPhrases = [
    'Search premium cameras...',
    'Search high-end lenses...',
    'Search pro lighting kits...',
    'Search cinema drones...',
    'Search audio equipment...',
    'Search production gear...'
  ];

  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentPhrase = placeholderPhrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (placeholderText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPhrase.slice(0, placeholderText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000); // Wait at end
      }
    } else {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(placeholderText.slice(0, placeholderText.length - 1));
        }, 50);
      } else {
        setPhraseIndex((prev) => (prev + 1) % placeholderPhrases.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isTyping, phraseIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-line/40 bg-white/80 py-3 backdrop-blur-xl shadow-sm'
          : 'bg-transparent py-5'
      )}
    >
      <div className="app-shell flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Logo Section - Refined for professional weight */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <Camera className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <p className="text-base sm:text-lg font-bold tracking-tight text-ink leading-none">CineKit</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-muted/80 mt-1">Pro Rentals</p>
          </div>
        </Link>

        {/* Center: Search Bar (Desktop) with Typing Animation */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl items-center relative group"
        >
          <div className="absolute left-4 z-10">
            <Search className="h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-14 rounded-2xl border border-line/60 bg-page/40 backdrop-blur-sm text-sm font-medium transition-all focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 hover:border-primary/20 outline-none truncate placeholder:text-muted/60"
          />
          <Link
            to="/category"
            className="absolute right-2 h-8 w-8 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="View Categories"
          >
            <LayoutGrid className="h-4 w-4" />
          </Link>
        </form>

        {/* Right Section: Balanced icons & account */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => navigate('/category')}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-page transition-colors"
          >
            <Search className="h-5 w-5 text-ink" />
          </button>

          {/* Favourites & Cart Icons (xl+ only) */}
          <Link
            to="/favourites"
            className="group relative hidden xl:flex h-10 w-10 items-center justify-center rounded-full hover:bg-page transition-colors"
          >
            <Heart className="h-5 w-5 text-ink group-hover:text-primary transition-colors" />
            {favourites.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {favourites.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="group relative hidden xl:flex h-10 w-10 items-center justify-center rounded-full hover:bg-page transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-ink group-hover:text-primary transition-colors" />
            {items.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {items.length}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <HeadlessMenu as="div" className="relative">
              <HeadlessMenu.Button className="flex items-center gap-2.5 rounded-full p-1 pr-3 border border-line/40 hover:bg-page hover:border-line transition-all duration-200 focus:outline-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-hover text-white font-bold text-sm shrink-0">
                  {user?.fullName?.[0] || 'U'}
                </div>
                <span className="text-sm font-semibold text-ink max-w-[80px] sm:max-w-[150px] lg:max-w-[200px] truncate">
                  Hey, <span className="text-primary">{user?.fullName}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted shrink-0" />
              </HeadlessMenu.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-line rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                  <div className="px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Signed in as</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-ink">{user?.fullName}</p>
                  </div>
                  <div className="py-2">
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <Link to="/account" className={clsx('group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-primary-light text-primary' : 'text-ink/80 hover:text-primary')}>
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <Link to="/account?tab=rentals" className={clsx('group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-primary-light text-primary' : 'text-ink/80 hover:text-primary')}>
                          <Package className="h-4 w-4" /> My Rentals
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                  </div>
                  <div className="py-2">
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <button onClick={logout} className={clsx('group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-danger transition-colors', active ? 'bg-danger/10' : 'hover:bg-danger/5')}>
                          <LogOut className="h-4 w-4" /> Log out
                        </button>
                      )}
                    </HeadlessMenu.Item>
                  </div>
                </HeadlessMenu.Items>
              </Transition>
            </HeadlessMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="secondary-button !h-10 min-w-[70px] sm:min-w-[90px] !px-4 !text-sm flex items-center justify-center !rounded-full"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="primary-button !h-10 min-w-[70px] sm:min-w-[90px] !px-4 !text-sm flex items-center justify-center !rounded-full"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
