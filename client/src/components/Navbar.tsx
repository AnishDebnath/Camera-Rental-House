import { Camera, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <header className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur">
    <div className="app-shell flex h-20 items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold text-ink">CineKit</p>
          <p className="text-xs text-muted">Professional rental house</p>
        </div>
      </Link>
      <div className="hidden items-center gap-2 md:flex">
        <a href="http://localhost:5175/login" className="secondary-button">
          Login
        </a>
        <a href="http://localhost:5175/signup" className="primary-button">
          Sign Up
        </a>
      </div>
      <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden">
        <Menu className="h-5 w-5" />
      </button>
    </div>
  </header>
);

export default Navbar;
