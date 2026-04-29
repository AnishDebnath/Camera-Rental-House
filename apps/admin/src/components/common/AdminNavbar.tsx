import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { clearAdminSession, getAuthRole } from '../../../../../packages/auth';
import { resolveAuthAppUrl } from '../../../../../packages/auth/appUrls';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const AdminNavbar = ({ onOpenSidebar }) => {
  const role = getAuthRole();
  const isStaff = role === 'staff';

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/[0.58] backdrop-blur-2xl xl:pl-72">
      <div className="admin-shell flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white xl:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="xl:hidden">
            <p className="text-base font-bold text-ink">Camera House</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">
              {isStaff ? 'staff mode' : 'admin mode'}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="input-shell h-11 min-h-0 w-full max-w-md rounded-pill border-white bg-white/[0.78] px-5 shadow-sm">
            <input
              type="search"
              placeholder="Search products, rentals, customers..."
              className="w-full border-0 bg-transparent p-0 text-sm font-medium text-ink placeholder:text-tertiary focus:ring-0"
            />
            <Search className="h-4 w-4 text-muted" />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-[11px] font-bold text-ink">
              3
            </span>
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-bold text-ink">{isStaff ? 'Counter Staff' : 'Admin Manager'}</p>
              <p className="text-xs font-medium text-muted">{isStaff ? 'Store Counter' : 'Store Manager'}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-sky-100 text-sm font-bold text-ink">
              CR
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              clearAdminSession();
              window.location.replace(`${authAppUrl}/login?clear_session=true`);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:bg-primary hover:text-white"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
