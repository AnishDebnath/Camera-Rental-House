import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  UserRound,
  Phone,
  ShieldCheck,
  Loader2,
  ExternalLink,
  History,
  Search,
  PlusCircle,
  TrendingUp,
  Wallet,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@camera-rental-house/ui';
import axiosInstance from '../../api/axiosInstance';

// Real rental history will be fetched from API


const HouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [house, setHouse] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const { addToast } = useToast();

  const [houseRentals, setHouseRentals] = useState<any[]>([]);

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const [detailRes, rentalsRes] = await Promise.all([
          axiosInstance.get(`/admin/houses/${id}`),
          axiosInstance.get(`/admin/rentals/house/${id}`)
        ]);
        
        setHouse(detailRes.data);
        setHouseRentals(rentalsRes.data || []);

        if (detailRes.data.users?.email) {
          setCredentials(prev => ({ ...prev, username: detailRes.data.users.email }));
        }
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch house details.', tone: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchHouseData();
  }, [id, addToast]);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.password) return;
    setIsUpdatingCreds(true);
    try {
      await axiosInstance.post(`/admin/houses/${id}/credentials`, credentials);
      addToast({ title: 'Success', message: 'Credentials updated successfully.', tone: 'success' });
      setCredentials(prev => ({ ...prev, password: '' }));
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to update credentials.', tone: 'error' });
    } finally {
      setIsUpdatingCreds(false);
    }
  };

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
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100/50">
                    <Hash className="h-3 w-3" />
                    {house.house_id}
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100/50">
                    <Hash className="h-3 w-3" />
                    {house.house_id}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                {/* Premium Contact Pills */}
                <div className="flex items-center rounded-xl bg-white border border-line/60 p-1 shadow-sm cursor-default">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                  <span className="px-3 text-[11px] sm:text-[13px] font-bold text-ink/80">{house.owner_name || house.ownerName}</span>
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



        {/* Credentials Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[1rem] border border-line shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-line bg-slate-50/50">
            <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Owner Credentials
            </h3>
            <p className="text-[10px] font-bold text-muted uppercase mt-0.5">Manage client-side login for this house</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">User ID (Member ID)</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-line/60">
                    <UserRound className="h-4 w-4 text-primary" />
                    <span className="text-sm font-black text-ink">{house.users?.member_id || 'NOT LINKED'}</span>
                  </div>
                </div>
                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">Username / Email</label>
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      placeholder="Enter login email"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-line outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      placeholder="Set new password"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-line outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdatingCreds || !credentials.password}
                    className="primary-button w-full h-12 flex items-center justify-center gap-2"
                  >
                    {isUpdatingCreds ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Credentials'}
                  </button>
                </form>
              </div>
              <div className="bg-indigo-50/30 rounded-2xl p-5 border border-indigo-100/50 flex flex-col justify-center">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 mb-3">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black text-ink leading-tight mb-2">Client Portal Access</h4>
                <p className="text-[11px] font-bold text-muted leading-relaxed">
                  The house owner can use these credentials to login at the client-side portal.
                  They will be able to see their active rentals, history, and financial statements.
                </p>
                <div className="mt-4 pt-4 border-t border-indigo-100/50 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Account is Active
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Lifetime Card - Dark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-[1.5rem] p-6 shadow-lg border border-white/5 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Business</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Lifetime</p>
              <h3 className="text-2xl font-black text-white tabular-nums tracking-tight">
                {house.dueAmount || '₹0'}
              </h3>
            </div>
          </motion.div>

          {/* Monthly Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-line relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Monthly</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-muted uppercase tracking-wider mb-1">This Month</p>
              <h3 className="text-2xl font-black text-ink tabular-nums tracking-tight">
                {house.thisMonthBusiness || '₹0'}
              </h3>
            </div>
          </motion.div>

          {/* Pending Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-line relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Pending</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-muted uppercase tracking-wider mb-1">Pending Due</p>
              <h3 className="text-2xl font-black text-ink tabular-nums tracking-tight">
                {house.dueAmount || '₹0'}
              </h3>
            </div>
          </motion.div>
        </div>
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
                {houseRentals.map((rental) => (
                  <tr key={rental.id} className="group transition-colors border-b border-line/20">
                    <td colSpan={6} className="p-0">
                      <div
                        className={`flex items-center w-full group/row cursor-pointer transition-colors ${expandedOrderId === rental.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                        onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                      >
                        <div className="w-[12%] px-6 py-5">
                          <span className="text-sm font-black tracking-tight text-ink uppercase">{rental.rental_no || rental.id.slice(0, 8)}</span>
                        </div>
                        <div className="w-[28%] px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Pickup</span>
                              <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{new Date(rental.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="h-px w-4 bg-line/60 mt-4" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Return</span>
                              <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{new Date(rental.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-[25%] px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black leading-none truncate">{rental.products?.[0]?.name || 'N/A'}</span>
                            <span className="text-[11px] font-bold text-muted uppercase tracking-widest">{rental.products?.length || 0} Items Total</span>
                          </div>
                        </div>
                        <div className="w-[15%] px-6 py-5 text-right">
                          <span className="text-[15px] font-black text-ink tabular-nums">₹{Number(rental.total_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="w-[14%] px-6 py-5">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                              ${rental.status === 'returned' || rental.status === 'Returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                rental.status === 'confirmed' || rental.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  'bg-slate-50 text-slate-500 border-slate-100'}
                            `}>
                              <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'returned' || rental.status === 'Returned' ? 'bg-emerald-500' : rental.status === 'confirmed' || rental.status === 'Active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
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
                                  <span className="text-[10px] font-bold text-primary uppercase">{rental.products?.length || 0} Items</span>
                                </div>
                                <div className="divide-y divide-line/40">
                                  {rental.products?.map((item: any, idx: number) => (
                                    <div key={idx} className="px-4 py-3.5 flex items-center justify-between gap-6 hover:bg-slate-50/30 transition-colors">
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-black text-ink leading-tight">{item.name}</span>
                                        <div className="mt-1">
                                          <span className="text-[10px] font-mono font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tight">{item.unique_code || item.code}</span>
                                        </div>
                                      </div>
                                      <div className="w-24 text-right flex-shrink-0">
                                        <span className="text-[15px] font-black text-ink tabular-nums">₹{Number(item.price || 0).toLocaleString()}</span>
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
              {houseRentals.map((rental) => (
                <div
                  key={rental.id}
                  className={`p-5 rounded-2xl bg-white border shadow-sm transition-all active:scale-[0.98] cursor-pointer h-fit ${expandedOrderId === rental.id ? 'border-primary/30 ring-4 ring-primary/5 shadow-md' : 'border-line/40 hover:shadow-md'}`}
                  onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-tight text-ink uppercase">{rental.rental_no || rental.id.slice(0, 8)}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                          ${rental.status === 'returned' || rental.status === 'Returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            rental.status === 'confirmed' || rental.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-slate-50 text-slate-500 border-slate-100'}
                        `}>
                          <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'returned' || rental.status === 'Returned' ? 'bg-emerald-500' : rental.status === 'confirmed' || rental.status === 'Active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
                          {rental.status}
                        </span>
                      </div>
                      <div className="mt-1.5 inline-flex flex-col">
                        <span className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-0.5">Grand Total</span>
                        <span className="text-[18px] font-black text-ink tabular-nums leading-none">₹{Number(rental.total_amount || 0).toLocaleString()}</span>
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
                        <span className="text-[13px] font-bold text-ink leading-tight">{new Date(rental.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                    <div className="h-4 w-px bg-line/40" />
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Return</span>
                        <span className="text-[13px] font-bold text-ink leading-tight">{new Date(rental.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm border border-line/40">
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-ink truncate max-w-[220px]">{rental.products?.[0]?.name || 'N/A'}</span>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{rental.products?.length || 0} Items Total</span>
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
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{rental.products?.length || 0} Items</span>
                          </div>
                          {rental.products?.map((item: any, idx: number) => (
                            <div key={idx} className="group/item relative p-4 rounded-2xl border border-line/40 bg-white shadow-sm hover:border-primary/30 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-[13px] font-black text-ink leading-tight">{item.name}</span>
                                  <div className="mt-1">
                                    <span className="text-[10px] font-mono font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">{item.unique_code || item.code}</span>
                                  </div>
                                </div>
                                <div className="w-20 text-right flex-shrink-0 pt-0.5">
                                  <span className="text-[14px] font-black text-ink tabular-nums">₹{Number(item.price || 0).toLocaleString()}</span>
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
