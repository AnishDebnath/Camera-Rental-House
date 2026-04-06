import clsx from 'clsx';
import { LayoutDashboard, Package, Users, CalendarClock, ScanLine, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getDemoRole } from '../../../../packages/auth';

const items = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: true },
  { label: 'Products', href: '/products', icon: Package, adminOnly: true },
  { label: 'Users', href: '/users', icon: Users, adminOnly: true },
  { label: 'Rentals', href: '/rentals', icon: CalendarClock },
  { label: 'Release / Return', href: '/release', icon: ScanLine },
];

const Sidebar = ({ open, onClose }) => {
  const { pathname } = useLocation();
  const role = getDemoRole();
  const isManager = role === 'manager';

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 left-0 z-50 w-72 border-r px-5 py-6 transition-transform lg:translate-x-0 ${
            isManager
              ? 'border-amber-200 bg-amber-50'
              : 'border-line bg-white'
          }`,
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className={`mb-6 rounded-3xl px-4 py-4 ${isManager ? 'bg-white' : 'bg-page'}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
            {isManager ? 'Manager Demo' : 'Admin Demo'}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {isManager
              ? 'Counter-first access for release and return flows.'
              : 'Full operations access for products, users, and analytics.'}
          </p>
        </div>
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <p className="text-lg font-semibold text-ink">Navigation</p>
          <button type="button" onClick={onClose} className="rounded-full bg-page p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {items
            .filter((item) => (item.adminOnly ? role === 'admin' : true))
            .map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={clsx(
                    'flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                    active
                      ? isManager
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-primary-light text-primary-dark'
                      : isManager
                        ? 'text-amber-900/70 hover:bg-white hover:text-amber-900'
                        : 'text-muted hover:bg-page hover:text-ink',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
