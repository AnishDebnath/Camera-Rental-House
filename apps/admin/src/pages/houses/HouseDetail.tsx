import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  UserRound,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Wallet,
  Clock,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Package,
  Receipt,
  FileText,
  ShieldCheck,
  Loader2,
  ExternalLink,
  History,
  Search,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockHouses } from './index';

// Mock rental history for houses
const mockHouseRentals = [
  {
    id: 'ORD-7624',
    date: '10 May 2024',
    amount: '₹45,000',
    status: 'Returned',
    items: 4,
    mainGear: 'Arri Alexa 35 Package',
  },
  {
    id: 'ORD-7581',
    date: '22 Apr 2024',
    amount: '₹28,500',
    status: 'Returned',
    items: 2,
    mainGear: 'Sony Venice 2 Body',
  },
  {
    id: 'ORD-7512',
    date: '05 Apr 2024',
    amount: '₹12,000',
    status: 'Cancelled',
    items: 1,
    mainGear: 'RED V-Raptor',
  },
  {
    id: 'ORD-7440',
    date: '18 Mar 2024',
    amount: '₹62,000',
    status: 'Returned',
    items: 7,
    mainGear: 'Master Prime Lens Set',
  },
  {
    id: 'ORD-7392',
    date: '02 Mar 2024',
    amount: '₹18,500',
    status: 'Returned',
    items: 3,
    mainGear: 'DJI Ronin 2 Stabilizer',
  }
];

const HouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const house = useMemo(() => {
    return mockHouses.find(h => h.id === id);
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="admin-shell py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-300">
          <Building2 className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-black text-ink">Production House Not Found</h2>
        <p className="mt-2 text-sm font-medium text-muted">The record you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/houses')}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <button
          onClick={() => navigate('/houses')}
          className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Houses
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/house-booking?houseId=${house.id}`}
            className="primary-button group text-[11px] font-black uppercase tracking-widest px-6"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </div>
      </div>

      {/* Profile Header & Stats */}
      <div className="flex flex-col gap-5">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-5 sm:p-6"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            {/* House Icon/Avatar */}
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] sm:rounded-[1.75rem] bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-indigo-100/50">
                <Building2 className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 text-white shadow-sm">
                <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </div>

            {/* House Details */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
              <div className="flex items-center">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-ink truncate leading-tight">
                  {house.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-5 pt-0.5">
                <div className="flex items-center gap-2 text-ink/80">
                  <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500 border border-slate-100">
                    <UserRound className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-sm font-bold leading-none">{house.ownerName}</p>
                  </div>
                </div>

                <div className="h-7 w-px bg-line/60 hidden sm:block" />

                <div className="flex items-center gap-2 text-ink/80">
                  <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-sky-500 border border-slate-100">
                    <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-sm font-bold leading-none">{house.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Financial Stats */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {/* Lifetime Business */}
          <div className="card-surface p-6 bg-slate-900 border-none shadow-xl shadow-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business</span>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-1">Lifetime</p>
            <p className="text-2xl font-black text-white tracking-tight">{house.totalBusiness}</p>
          </div>

          {/* This Month Business */}
          <div className="card-surface p-6 bg-white shadow-sm border border-line">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Monthly</span>
            </div>
            <p className="text-xs font-bold text-muted mb-1">This Month</p>
            <p className="text-2xl font-black text-ink tracking-tight">₹1,25,000</p>
          </div>

          {/* Pending Dues */}
          <div className="card-surface p-6 bg-white shadow-sm border border-line">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Pending</span>
            </div>
            <p className="text-xs font-bold text-muted mb-1">Pending Due</p>
            <p className={`text-2xl font-black tracking-tight ${house.dueAmount === '₹0' ? 'text-muted/20' : 'text-rose-600'}`}>{house.dueAmount}</p>
          </div>
        </motion.section>
      </div>

      {/* Order History Table Section */}
      <div className="space-y-5">

        {/* Rental History Table */}
        <section className="card-surface p-0 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-line/50 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-ink leading-none">Order History</h2>
                <p className="text-[10px] font-bold text-muted uppercase mt-1.5">Complete record of rental activities</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search orders..."
                className="h-9 w-full sm:w-64 rounded-xl border border-line bg-slate-50 pl-9 pr-4 text-xs font-medium outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted border-b border-line/40">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted border-b border-line/40">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted border-b border-line/40">Primary Gear</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted border-b border-line/40 text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted border-b border-line/40 text-center">Status</th>
                  <th className="px-6 py-4 border-b border-line/40 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {mockHouseRentals.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-ink">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted/60" />
                        <span className="text-xs font-semibold text-ink">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-ink leading-none">{order.mainGear}</p>
                        <p className="text-[10px] font-medium text-muted">+{order.items - 1} other items</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-ink">{order.amount}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${order.status === 'Returned' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-sky-50 text-sky-600 border border-sky-100'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:bg-white hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-line/40">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-line/40 bg-slate-50/30 flex justify-center">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline underline-offset-4 flex items-center gap-2">
              View Full History Archive
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </section>
      </div>
    </div>

  );
};

export default HouseDetail;
