import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  CalendarClock,
  LayoutDashboard,
  Package,
  ScanLine,
  Settings,
  Users,
  X,
  LogOut,
  Building2,
  Wallet,
  UserCog,
  History,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getAuthRole, clearAdminSession } from '../../../../../packages/auth';
import { resolveAuthAppUrl } from '../../../../../packages/auth/appUrls';
import axiosInstance from '../../api/axiosInstance';
import logo from '@camera-rental-house/ui/assets/logo.png';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const Sidebar = ({ open, onClose }) => {
  const { pathname } = useLocation();
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [counts, setCounts] = useState<{ products: number; rentals: number; users: number }>({
    products: 0,
    rentals: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoint = isStaff ? '/manage/counts' : '/admin/dashboard';
        const { data } = await axiosInstance.get(endpoint);
        
        setCounts({
          products: data.totalActiveRentals || 0, // Show active rentals in product tab as requested
          rentals: data.totalActiveRentals || 0,
          users: data.totalUsers || 0,
        });
      } catch (err) {
        console.error('Sidebar counts fetch fail:', err);
      }
    };

    fetchCounts();
  }, [isStaff]);

  const menuGroups = [
    {
      title: 'Core',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Inventory & Operations',
      items: [
        { 
          label: 'Products', 
          href: '/products', 
          icon: Package, 
          adminOnly: true, 
          count: counts.products > 0 ? String(counts.products) : undefined 
        },
        { 
          label: 'Rentals', 
          href: '/rentals', 
          icon: CalendarClock, 
          count: counts.rentals > 0 ? String(counts.rentals) : undefined 
        },
        { 
          label: 'Rental History', 
          href: '/rentals/history', 
          icon: History,
          adminOnly: true 
        },
        { label: 'Release / Return', href: '/release', icon: ScanLine },
      ],
    },
    {
      title: 'Partners & People',
      items: [
        { label: 'Production Houses', href: '/houses', icon: Building2 },
        { 
          label: 'Platform Users', 
          href: '/users', 
          icon: Users, 
          adminOnly: true, 
          count: counts.users > 0 ? String(counts.users) : undefined 
        },
        { label: 'Team Members', href: '/staff', icon: UserCog, adminOnly: true },
      ],
    },
    {
      title: 'Financials',
      items: [
        { label: 'Accounts', href: '/accounts', icon: Wallet, adminOnly: true },
      ],
    },
  ];

  return (
    <>
      <div
        className={clsx(
          'z-40 bg-slate-950/25 backdrop-blur-sm transition xl:hidden',
          open ? 'fixed inset-0 pointer-events-auto opacity-100' : 'hidden pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/70 bg-white/[0.72] px-4 py-5 shadow-[18px_0_50px_rgba(31,41,55,0.07)] backdrop-blur-2xl transition-transform xl:flex xl:translate-x-0',
          open ? 'flex translate-x-0' : 'hidden -translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link to="/" onClick={onClose} className="flex items-center">
            <img src={logo} alt="Camera Rental House" className="h-12 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white xl:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="relative h-11 w-11 shrink-0">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 to-sky-100 text-sm font-bold text-ink border border-white/40">
              CR
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-bold text-ink">
              {isStaff ? 'Counter Staff' : 'Admin Manager'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted/80">
              {isStaff ? 'Store Counter' : 'Store Manager'}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto pr-1 custom-scrollbar">
          {menuGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !item.adminOnly || role === 'admin');
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-2">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    let active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                    
                    // Special case: /rentals should not be active if we are in /rentals/history
                    if (item.href === '/rentals' && pathname.startsWith('/rentals/history')) {
                      active = false;
                    }
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={onClose}
                        className={clsx(
                          'flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all',
                          active
                            ? 'bg-primary text-white shadow-[0_10px_20px_rgba(0,0,0,0.12)]'
                            : 'text-slate-500 hover:bg-white hover:text-ink',
                        )}
                      >
                        <Icon className={clsx('h-4.5 w-4.5 shrink-0', active ? 'text-white' : 'text-slate-400')} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.count && (
                          <span
                            className={clsx(
                              'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black',
                              active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500',
                            )}
                          >
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={() => {
              clearAdminSession();
              window.location.replace(`${authAppUrl}/login?clear_session=true`);
            }}
            className="group flex w-full items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-black text-rose-600 transition-all hover:bg-rose-100 hover:shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:scale-110">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
