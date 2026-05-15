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
    pickupDate: '10 May 2024',
    returnDate: '12 May 2024',
    amount: '₹45,000',
    status: 'Returned',
    itemsCount: 4,
    mainGear: 'Arri Alexa 35 Package',
    items: [
      { name: 'Arri Alexa 35 Body', code: 'CAM-A35-01', price: '₹35,000' },
      { name: 'Arri Signature Prime 35mm lense with light', code: 'LNS-ASP-01', price: '₹5,000' },
      { name: 'SmallHD Ultra 7', code: 'MON-SHD-05', price: '₹2,500' },
      { name: 'Teradek Bolt 6 XT', code: 'WRL-TDK-02', price: '₹2,500' }
    ]
  },
  {
    id: 'ORD-7581',
    pickupDate: '22 Apr 2024',
    returnDate: '24 Apr 2024',
    amount: '₹28,500',
    status: 'Returned',
    itemsCount: 2,
    mainGear: 'Sony Venice 2 Body',
    items: [
      { name: 'Sony Venice 2 Body', code: 'CAM-SV2-03', price: '₹25,000' },
      { name: 'Wooden Camera Cage', code: 'ACC-WDC-01', price: '₹3,500' }
    ]
  },
  {
    id: 'ORD-7512',
    pickupDate: '05 Apr 2024',
    returnDate: '06 Apr 2024',
    amount: '₹12,000',
    status: 'Cancelled',
    itemsCount: 1,
    mainGear: 'RED V-Raptor',
    items: [
      { name: 'RED V-Raptor 8K VV', code: 'CAM-RED-04', price: '₹12,000' }
    ]
  },
  {
    id: 'ORD-7440',
    pickupDate: '18 Mar 2024',
    returnDate: '22 Mar 2024',
    amount: '₹62,000',
    status: 'Returned',
    itemsCount: 7,
    mainGear: 'Master Prime Lens Set',
    items: [
      { name: 'Master Prime 18mm', code: 'LNS-ZMP-01', price: '₹8,500' },
      { name: 'Master Prime 25mm', code: 'LNS-ZMP-02', price: '₹8,500' },
      { name: 'Master Prime 35mm', code: 'LNS-ZMP-03', price: '₹8,500' },
      { name: 'Master Prime 50mm', code: 'LNS-ZMP-04', price: '₹8,500' },
      { name: 'Master Prime 75mm', code: 'LNS-ZMP-05', price: '₹8,500' },
      { name: 'Master Prime 100mm', code: 'LNS-ZMP-06', price: '₹8,500' },
      { name: 'Lens Case (Hard)', code: 'ACC-CSE-09', price: '₹11,000' }
    ]
  }
];

const HouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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
          className="bg-white rounded-[1rem] border border-line shadow-sm relative overflow-hidden"
        >
          {/* Decorative background gradient */}
          <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-4 sm:contents">
              {/* Premium House Icon/Avatar */}
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
                <div className="relative flex h-full w-full items-center justify-center rounded-lg sm:rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-indigo-100/50">
                  <Building2 className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 text-white shadow-sm">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>

              {/* Mobile Title Row */}
              <div className="flex-1 min-w-0 sm:hidden">
                <h1 className="text-xl font-black tracking-tight text-ink truncate leading-tight">
                  {house.name}
                </h1>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100/50">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* House Details */}
            <div className="flex-1 min-w-0 space-y-3 sm:space-y-1.5">
              <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink truncate leading-tight">
                    {house.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100/50">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                {/* Premium Contact Pills */}
                <div className="flex items-center rounded-xl bg-white border border-line/60 p-1 shadow-sm cursor-default">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                  <span className="px-3 text-[11px] sm:text-[13px] font-bold text-ink/80">{house.ownerName}</span>
                </div>

                <div className="flex items-center rounded-xl bg-white border border-line/60 p-1 shadow-sm cursor-default">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <span className="px-3 text-[11px] sm:text-[13px] font-bold text-ink/80 tabular-nums">{house.phone}</span>
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
          <div className="p-6 bg-slate-900 rounded-[1.5rem] border border-slate-800">
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
          <div className="p-6 bg-white shadow-sm border border-line rounded-[1.5rem]">
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
          <div className="p-6 bg-white shadow-sm border border-line rounded-[1.5rem]">
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
          <div className="p-5 md:p-6 border-b border-line/40 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-5">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center text-indigo-600 border border-slate-200/60 shadow-sm">
                <History className="h-5 w-5" />
              </div>
              <div className='flex flex-col'>
                <h2 className="text-lg font-black text-ink tracking-tight">Rental History</h2>
                <p className="text-[10px] font-bold text-muted uppercase">Complete record of rental activities</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-muted group-focus-within:text-primary transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Search rentals..."
                className="h-10 w-full sm:w-72 lg:w-[450px] rounded-xl border border-line bg-slate-50/50 pl-10 pr-4 text-[13px] font-bold text-ink outline-none focus:border-primary/50 focus:bg-white focus:ring-[4px] focus:ring-primary/5 transition-all placeholder:text-muted/40"
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="w-[12%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40">Rental ID</th>
                  <th className="w-[28%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40">Rental Period</th>
                  <th className="w-[25%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40">Items</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40 text-right">Amount</th>
                  <th className="w-[14%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40 text-center">Status</th>
                  <th className="w-[6%] px-6 py-4 border-b border-line/40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {mockHouseRentals.map((rental) => (
                  <tr key={rental.id} className="group transition-colors border-b border-line/20">
                    <td colSpan={6} className="p-0">
                      <div
                        className={`flex items-center w-full group/row cursor-pointer transition-colors ${expandedOrderId === rental.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                        onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                      >
                        <div className="w-[12%] px-6 py-5">
                          <span className="text-sm font-black tracking-tight text-ink">{rental.id}</span>
                        </div>
                        <div className="w-[28%] px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Pickup</span>
                              <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{rental.pickupDate}</span>
                            </div>
                            <div className="h-px w-4 bg-line/60 mt-4" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Return</span>
                              <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{rental.returnDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-[25%] px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black leading-none truncate">{rental.items[0]?.name}</span>
                            <span className="text-[11px] font-bold text-muted uppercase tracking-widest">{rental.itemsCount} Items Total</span>
                          </div>
                        </div>
                        <div className="w-[15%] px-6 py-5 text-right">
                          <span className="text-[15px] font-black text-ink tabular-nums">{rental.amount}</span>
                        </div>
                        <div className="w-[14%] px-6 py-5">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                              ${rental.status === 'Returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                rental.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  'bg-slate-50 text-slate-500 border-slate-100'}
                            `}>
                              <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'Returned' ? 'bg-emerald-500' : rental.status === 'Active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
                              {rental.status}
                            </span>
                          </div>
                        </div>
                        <div className="w-[6%] px-6 py-5 text-center">
                          <ChevronRight className={`h-5 w-5 text-muted transition-transform duration-300 ${expandedOrderId === rental.id ? 'rotate-90 text-primary' : ''}`} />
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {expandedOrderId === rental.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden bg-slate-50/40 border-t border-line/30"
                          >
                            <div className="px-6 py-5">
                              <div className="bg-white rounded-xl border border-line/60 shadow-sm overflow-hidden">
                                <div className="bg-slate-50/50 px-4 py-2 border-b border-line/40 flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">Detailed Rentals</span>
                                  <span className="text-[10px] font-bold text-primary uppercase">{rental.itemsCount} Items</span>
                                </div>
                                <div className="divide-y divide-line/40">
                                  {rental.items?.map((item, idx) => (
                                    <div key={idx} className="px-4 py-3.5 flex items-center justify-between gap-6 hover:bg-slate-50/30 transition-colors">
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-black text-ink leading-tight">{item.name}</span>
                                        <div className="mt-1">
                                          <span className="text-[10px] font-mono font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tight">{item.code}</span>
                                        </div>
                                      </div>
                                      <div className="w-24 text-right flex-shrink-0">
                                        <span className="text-[15px] font-black text-ink tabular-nums">{item.price}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden pb-4 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {mockHouseRentals.map((rental) => (
                <div
                  key={rental.id}
                  className={`p-5 rounded-2xl bg-white border shadow-sm transition-all active:scale-[0.98] cursor-pointer h-fit ${expandedOrderId === rental.id ? 'border-primary/30 ring-4 ring-primary/5 shadow-md' : 'border-line/40 hover:shadow-md'}`}
                  onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-tight text-ink">{rental.id}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                          ${rental.status === 'Returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            rental.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-slate-50 text-slate-500 border-slate-100'}
                        `}>
                          <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'Returned' ? 'bg-emerald-500' : rental.status === 'Active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
                          {rental.status}
                        </span>
                      </div>
                      <div className="mt-1.5 inline-flex flex-col">
                        <span className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-0.5">Grand Total</span>
                        <span className="text-[18px] font-black text-ink tabular-nums leading-none">{rental.amount}</span>
                      </div>
                    </div>
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${expandedOrderId === rental.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 border-line text-muted'}`}>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${expandedOrderId === rental.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-y border-line/20 mb-4 bg-slate-50/30 -mx-5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm border border-line/40">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Pickup</span>
                        <span className="text-[13px] font-bold text-ink leading-tight">{rental.pickupDate}</span>
                      </div>
                    </div>
                    <div className="h-4 w-px bg-line/40" />
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Return</span>
                        <span className="text-[13px] font-bold text-ink leading-tight">{rental.returnDate}</span>
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm border border-line/40">
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-ink truncate max-w-[220px]">{rental.items[0]?.name}</span>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{rental.itemsCount} Items Total</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrderId === rental.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-2.5">
                          <div className="flex items-center justify-between px-1 mb-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Detailed Rentals</span>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{rental.itemsCount} Items</span>
                          </div>
                          {rental.items?.map((item, idx) => (
                            <div key={idx} className="group/item relative p-4 rounded-2xl border border-line/40 bg-white shadow-sm hover:border-primary/30 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-[13px] font-black text-ink leading-tight">{item.name}</span>
                                  <div className="mt-1">
                                    <span className="text-[10px] font-mono font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">{item.code}</span>
                                  </div>
                                </div>
                                <div className="w-20 text-right flex-shrink-0 pt-0.5">
                                  <span className="text-[14px] font-black text-ink tabular-nums">{item.price}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default HouseDetail;
