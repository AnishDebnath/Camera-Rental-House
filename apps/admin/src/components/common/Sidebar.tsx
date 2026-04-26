import clsx from 'clsx';
import {
  CalendarClock,
  LayoutDashboard,
  Package,
  PackagePlus,
  ScanLine,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getAuthRole } from '../../../../../packages/auth';
import logo from '@camera-rental-house/ui/assets/logo.png';

const items = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: true },
  { label: 'Products', href: '/products', icon: Package, adminOnly: true, count: '24' },
  { label: 'Users', href: '/users', icon: Users, adminOnly: true, count: '32' },
  { label: 'Rentals', href: '/rentals', icon: CalendarClock, count: '18' },
  { label: 'Release / Return', href: '/release', icon: ScanLine },
  { label: 'Settings', href: '/release', icon: Settings, muted: true },
];

const Sidebar = ({ open, onClose }) => {
  const { pathname } = useLocation();
  const role = getAuthRole();
  const isStaff = role === 'staff';

  return (
    <>
      <div
        className={clsx(
          'z-40 bg-slate-950/25 backdrop-blur-sm transition lg:hidden',
          open ? 'fixed inset-0 pointer-events-auto opacity-100' : 'hidden pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/70 bg-white/[0.72] px-4 py-5 shadow-[18px_0_50px_rgba(31,41,55,0.07)] backdrop-blur-2xl transition-transform lg:flex lg:translate-x-0',
          open ? 'flex translate-x-0' : 'hidden -translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link to="/" onClick={onClose} className="flex items-center transition-opacity hover:opacity-80">
            <img src={logo} alt="Camera Rental House" className="h-11 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 rounded-card border border-line/70 bg-white/[0.78] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
            {isStaff ? 'Staff Counter' : 'Admin Console'}
          </p>
          <p className="mt-2 text-sm font-semibold leading-5 text-ink">
            {isStaff ? 'Rentals, release, and returns.' : 'Inventory, customers, and daily rentals.'}
          </p>
        </div>

        <nav className="space-y-1.5">
          {items
            .filter((item) => (item.adminOnly ? role === 'admin' : true))
            .map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href && !item.muted;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={onClose}
                  className={clsx(
                    'flex min-h-12 items-center gap-3 rounded-card px-4 py-3 text-sm font-semibold transition',
                    active
                      ? 'bg-primary text-white shadow-[0_14px_26px_rgba(0,0,0,0.16)]'
                      : 'text-slate-600 hover:bg-white hover:text-ink',
                    item.muted && 'opacity-60',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.count ? (
                    <span className={clsx('text-[11px] font-bold', active ? 'text-white' : 'text-ink')}>
                      {item.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
        </nav>

        <div className="mt-auto pt-5">
          <Link to={isStaff ? '/release' : '/products/add'} onClick={onClose} className="primary-button w-full">
            {isStaff ? <ScanLine className="mr-2 h-4 w-4" /> : <PackagePlus className="mr-2 h-4 w-4" />}
            {isStaff ? 'Open Station' : 'Add Product'}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
