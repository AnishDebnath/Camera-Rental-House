import { Ban, Trash2, UserRoundCheck, Loader2, Instagram, Facebook, Youtube, UserRound, IdCard, ExternalLink, ArrowLeft, Phone, Mail, Calendar, ShoppingCart, IndianRupee, Hash, Image as ImageIcon, ShieldCheck, Search, ChevronRight, History, PlusCircle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';
import ConfirmModal from '../../components/ui/ConfirmModal';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [confirmType, setConfirmType] = useState<'block' | 'delete' | 'verify' | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [rentalSearchTerm, setRentalSearchTerm] = useState('');

  const sortedRentals = useMemo(() => {
    let rentals = user?.rentals || [];

    if (rentalSearchTerm) {
      const term = rentalSearchTerm.toLowerCase();
      rentals = rentals.filter((r: any) =>
        (r.rental_no || '').toLowerCase().includes(term) ||
        (r.products || []).some((p: any) => p.name.toLowerCase().includes(term))
      );
    }

    return [...rentals].sort((a: any, b: any) =>
      new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime()
    );
  }, [user?.rentals, rentalSearchTerm]);

  const isChanged = (field: string) => !verified && changedFields.includes(field);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        setUser(response.data);
        setBlocked(response.data.is_blocked || false);
        setVerified(response.data.is_verified || false);
        setChangedFields(response.data.changed_fields || []);
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch user details.', tone: 'error' });
        navigate('/users');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id, addToast, navigate]);

  const handleVerify = async () => {
    setIsUpdating(true);
    try {
      await axiosInstance.put(`/admin/users/${id}/verify`);
      setVerified(true);
      setChangedFields([]);
      addToast({ title: 'Success', message: 'User verified successfully.', tone: 'success' });
      setConfirmType(null);
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to verify user.', tone: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlock = async () => {
    setIsUpdating(true);
    try {
      await axiosInstance.put(`/admin/users/${id}/block`);
      setBlocked(!blocked);
      addToast({ title: 'Success', message: `User ${blocked ? 'unblocked' : 'blocked'} successfully.`, tone: 'success' });
      setConfirmType(null);
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to update block status.', tone: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setDeleted(true);
      addToast({ title: 'Success', message: 'User deleted successfully.', tone: 'success' });
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to delete user.', tone: 'error' });
    } finally {
      setIsUpdating(false);
      setConfirmType(null);
    }
  };

  const onConfirmAction = () => {
    if (confirmType === 'verify') handleVerify();
    if (confirmType === 'block') handleBlock();
    if (confirmType === 'delete') handleDelete();
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (deleted || !user) {
    return (
      <div className="admin-shell py-6">
        <div className="bg-white rounded-[1rem] border border-line shadow-sm space-y-4 p-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink">User Removed</h1>
          <p className="text-sm font-medium text-muted">This user account has been removed from the system.</p>
          <button type="button" onClick={() => navigate('/users')} className="primary-button">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Users
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/house-booking?userId=${user.id}`}
            className="primary-button group text-[11px] font-black uppercase tracking-widest px-6"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Rental
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
              {/* Premium Avatar */}
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="h-full w-full rounded-xl object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-indigo-100/50">
                    <UserRound className="h-8 w-8 sm:h-9 sm:w-9" />
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-[3px] border-white text-white shadow-sm ${blocked ? 'bg-rose-500' : !verified ? 'bg-warning' : 'bg-emerald-500'}`}>
                  {blocked ? <Ban className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : !verified ? <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" /> : <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                </div>
              </div>

              {/* Mobile Title Row */}
              <div className="flex-1 min-w-0 sm:hidden">
                <h1 className="text-xl font-black tracking-tight text-ink truncate leading-tight">
                  {user.full_name}
                </h1>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-line/40 ${blocked ? 'bg-rose-50 text-rose-600' : !verified ? 'bg-warning/10 text-warning' : 'bg-emerald-50 text-emerald-600'}`}>
                    {blocked ? <Ban className="h-3 w-3" /> : !verified ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                    {blocked ? 'Blocked' : !verified ? 'Review Pending' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
              <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink truncate leading-tight">
                    {user.full_name}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-line/40 ${blocked ? 'bg-rose-50 text-rose-600' : !verified ? 'bg-warning/10 text-warning' : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'}`}>
                    {blocked ? <Ban className="h-3 w-3" /> : !verified ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                    {blocked ? 'Blocked' : !verified ? 'Review Pending' : 'Verified'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                {/* Member ID Pill */}
                <div className="flex items-center rounded-xl bg-slate-50 border border-line/60 p-1 shadow-sm cursor-default">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shadow-sm">
                    <Hash className="h-3.5 w-3.5" />
                  </div>
                  <div className="px-3 flex flex-col">
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest leading-none mb-0.5">Member ID</span>
                    <span className="text-[11px] sm:text-[13px] font-bold text-ink/80 tabular-nums leading-none">{user.member_id || 'PENDING'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher - Integrated at bottom of header card */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="relative flex h-11 w-full rounded-xl bg-slate-100 p-1 shadow-inner">
              <div
                className="absolute h-9 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-out"
                style={{ transform: `translateX(${activeTab === 'details' ? '0' : '100%'})` }}
              />
              <button
                onClick={() => setActiveTab('details')}
                className={`relative flex flex-1 items-center justify-center gap-2 text-sm font-black transition-colors ${activeTab === 'details' ? 'text-primary' : 'text-muted hover:text-ink'}`}
              >
                <UserRound className="h-4 w-4" />
                User Profile
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`relative flex flex-1 items-center justify-center gap-2 text-sm font-black transition-colors ${activeTab === 'history' ? 'text-primary' : 'text-muted hover:text-ink'}`}
              >
                <History className="h-4 w-4" />
                Rental History
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="space-y-4 md:space-y-6">
        {activeTab === 'details' ? (
          <>
            <section className="bg-white rounded-[1rem] border border-line shadow-sm p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
                <UserRound className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-ink">Personal Information</h2>
              </div>
              <div className="space-y-3">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                  {[
                    { label: 'Phone', value: user.phone || 'N/A', tone: 'bg-sky-50', Icon: Phone, iconColor: 'text-sky-600', field: 'phone' },
                    { label: 'Email', value: user.email || 'N/A', tone: 'bg-emerald-50', Icon: Mail, iconColor: 'text-emerald-600', field: 'email' },
                    { label: 'Joined', value: user.created_at ? `${String(new Date(user.created_at).getDate()).padStart(2, '0')}-${String(new Date(user.created_at).getMonth() + 1).padStart(2, '0')}-${new Date(user.created_at).getFullYear()}` : 'N/A', tone: 'bg-amber-50', Icon: Calendar, iconColor: 'text-amber-600', field: '' },
                  ].map((item) => (
                    <div key={item.label} className={`relative rounded-card p-4 text-sm font-medium text-muted transition-all ${item.tone} ${isChanged(item.field) ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}>
                      {isChanged(item.field) && (
                        <span className="absolute -top-2 right-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                          Changed
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <item.Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                        <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                      </div>
                      <p className="mt-1 break-words font-bold text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {[
                    { label: 'Total Rentals', value: `${user.totalRentals || 0} Orders`, tone: 'bg-indigo-50', Icon: ShoppingCart, iconColor: 'text-indigo-600' },
                    { label: 'Total Spent', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(user.totalSpent || 0), tone: 'bg-rose-50', Icon: IndianRupee, iconColor: 'text-rose-600' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-card p-4 text-sm font-medium text-muted ${item.tone}`}>
                      <div className="flex items-center gap-2">
                        <item.Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                        <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                      </div>
                      <p className="mt-1 break-words font-bold text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[1rem] border border-line shadow-sm p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
                <IdCard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-ink">Identity Verification</h2>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className={`rounded-card border p-4 flex flex-col gap-4 bg-white transition-all ${isChanged('aadhaar_no') || isChanged('aadhaar_doc_url') ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-line'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">Aadhaar Card</p>
                    {(isChanged('aadhaar_no') || isChanged('aadhaar_doc_url')) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                        Changed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 ml-1">
                      <Hash className="h-3 w-3 text-tertiary" />
                      <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">Document Number</p>
                    </div>
                    <div className="h-11 flex items-center px-4 rounded-xl border border-line bg-slate-50/50 text-sm font-semibold text-ink">
                      {user.aadhaar_no || <span className="text-muted/60">Not provided</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 ml-1">
                      <ImageIcon className="h-3 w-3 text-tertiary" />
                      <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">Digital Copy</p>
                    </div>
                    <div className="rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-50">
                      {user.aadhaar_signed_url ? (
                        <img src={user.aadhaar_signed_url} alt="Aadhaar" className="w-full object-contain" />
                      ) : (
                        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <IdCard className="h-6 w-6 opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Not Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`rounded-card border p-4 flex flex-col gap-4 bg-white transition-all ${isChanged('voter_no') || isChanged('voter_doc_url') ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-line'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">Voter ID</p>
                    {(isChanged('voter_no') || isChanged('voter_doc_url')) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                        Changed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 ml-1">
                      <Hash className="h-3 w-3 text-tertiary" />
                      <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">Document Number</p>
                    </div>
                    <div className="h-11 flex items-center px-4 rounded-xl border border-line bg-slate-50/50 text-sm font-semibold text-ink">
                      {user.voter_no || <span className="text-muted/60">Not provided</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 ml-1">
                      <ImageIcon className="h-3 w-3 text-tertiary" />
                      <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">Digital Copy</p>
                    </div>
                    <div className="rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-50">
                      {user.voter_signed_url ? (
                        <img src={user.voter_signed_url} alt="Voter card" className="w-full object-contain" />
                      ) : (
                        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <IdCard className="h-6 w-6 opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Not Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[1rem] border border-line shadow-sm p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
                <ExternalLink className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-ink">Social Connections</h2>
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-card border border-line bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </div>
                  {user.facebook ? (
                    <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="break-all text-sm font-medium text-primary hover:underline">
                      {user.facebook}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-muted">Not provided</p>
                  )}
                </div>

                <div className="rounded-card border border-line bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </div>
                  {user.instagram ? (
                    <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="break-all text-sm font-medium text-primary hover:underline">
                      {user.instagram}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-muted">Not provided</p>
                  )}
                </div>

                <div className="rounded-card border border-line bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                    <Youtube className="h-4 w-4 text-red-600" />
                    YouTube
                  </div>
                  {user.youtube ? (
                    <a href={user.youtube} target="_blank" rel="noopener noreferrer" className="break-all text-sm font-medium text-primary hover:underline">
                      {user.youtube}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-muted">Not provided</p>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="bg-white rounded-[1rem] border border-line shadow-sm p-0 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-line/40 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-5">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center text-primary border border-slate-200/60 shadow-sm">
                  <History className="h-5 w-5" />
                </div>
                <div className='flex flex-col'>
                  <h2 className="text-lg font-black text-ink tracking-tight">Rental History</h2>
                  <p className="text-[10px] font-bold text-muted uppercase">Complete record of user rentals</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-muted group-focus-within:text-primary transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search rentals..."
                  value={rentalSearchTerm}
                  onChange={(e) => setRentalSearchTerm(e.target.value)}
                  className="h-10 w-full sm:w-72 lg:w-[400px] rounded-xl border border-line bg-slate-50/50 pl-10 pr-4 text-[13px] font-bold text-ink outline-none focus:border-primary/50 focus:bg-white focus:ring-[4px] focus:ring-primary/5 transition-all placeholder:text-muted/40"
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
                  {sortedRentals.length > 0 ? (
                    sortedRentals.map((rental: any) => {
                      const totalAmt = rental.total_amount || (rental.products || []).reduce((sum: number, p: any) => sum + (Number(p.price || 0) * Number(p.qty || 1)), 0);
                      return (
                        <tr key={rental.id} className="group transition-colors border-b border-line/20">
                          <td colSpan={6} className="p-0">
                            <div
                              className={`flex items-center w-full group/row cursor-pointer transition-colors ${expandedOrderId === rental.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                              onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                            >
                              <div className="w-[12%] px-6 py-5">
                                <span className="text-sm font-black tracking-tight text-ink">{rental.rental_no || rental.id.slice(0, 8).toUpperCase()}</span>
                              </div>
                              <div className="w-[28%] px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Pickup</span>
                                    <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{new Date(rental.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                  </div>
                                  <div className="h-px w-4 bg-line/60 mt-4" />
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Return</span>
                                    <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{new Date(rental.return_date || rental.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="w-[25%] px-6 py-5">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-black leading-none truncate">{rental.products?.[0]?.name || 'Gear Rental'}</span>
                                  <span className="text-[11px] font-bold text-muted uppercase tracking-widest">{(rental.products || []).length} Items Total</span>
                                </div>
                              </div>
                              <div className="w-[15%] px-6 py-5 text-right">
                                <span className="text-[15px] font-black text-ink tabular-nums">₹{Number(totalAmt).toLocaleString()}</span>
                              </div>
                              <div className="w-[14%] px-6 py-5">
                                <div className="flex justify-center">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                                  ${rental.status === 'returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                      rental.status === 'released' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                        rental.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                          'bg-amber-50 text-amber-600 border-amber-100'}
                                `}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'returned' ? 'bg-emerald-500' :
                                      rental.status === 'released' ? 'bg-indigo-500 animate-pulse' :
                                        rental.status === 'cancelled' ? 'bg-rose-500' :
                                          'bg-amber-400'}`} />
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
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Detailed Items</span>
                                        <span className="text-[10px] font-bold text-primary uppercase">{(rental.products || []).length} Items</span>
                                      </div>
                                      <div className="divide-y divide-line/40">
                                        {(rental.products || []).map((item: any, idx: number) => (
                                          <div key={idx} className="px-4 py-3.5 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
                                            {item.image ? (
                                              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover border border-line shadow-sm shrink-0" />
                                            ) : (
                                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                <ImageIcon className="h-5 w-5 text-slate-300" />
                                              </div>
                                            )}
                                            <div className="flex flex-col min-w-0 flex-1">
                                              <span className="text-sm font-black text-ink leading-tight truncate">{item.name}</span>
                                              <div className="mt-1 flex items-center gap-2">
                                                {item.unique_code && (
                                                  <span className="text-[10px] font-mono font-bold text-muted bg-slate-50 px-2 py-0.5 rounded border border-line uppercase">{item.unique_code}</span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="w-24 text-right flex-shrink-0">
                                              <span className="text-[15px] font-black text-ink tabular-nums">₹{Number(item.price * (item.qty || 1)).toLocaleString()}</span>
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
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm font-medium text-muted uppercase tracking-widest opacity-40">
                        No matching rental history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden pb-4 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {sortedRentals.map((rental: any) => {
                  const totalAmt = rental.total_amount || (rental.products || []).reduce((sum: number, p: any) => sum + (Number(p.price || 0) * Number(p.qty || 1)), 0);
                  return (
                    <div
                      key={rental.id}
                      className={`p-5 rounded-2xl bg-white border shadow-sm transition-all active:scale-[0.98] cursor-pointer h-fit ${expandedOrderId === rental.id ? 'border-primary/30 ring-4 ring-primary/5 shadow-md' : 'border-line/40 hover:shadow-md'}`}
                      onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black tracking-tight text-ink">{rental.rental_no || rental.id.slice(0, 8).toUpperCase()}</span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                            ${rental.status === 'returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                rental.status === 'released' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                  rental.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    'bg-amber-50 text-amber-600 border-amber-100'}
                          `}>
                              <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'returned' ? 'bg-emerald-500' :
                                rental.status === 'released' ? 'bg-indigo-500 animate-pulse' :
                                  rental.status === 'cancelled' ? 'bg-rose-500' :
                                    'bg-amber-400'}`} />
                              {rental.status}
                            </span>
                          </div>
                          <div className="mt-1.5 inline-flex flex-col">
                            <span className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-0.5">Total Amount</span>
                            <span className="text-[18px] font-black text-ink tabular-nums leading-none">₹{Number(totalAmt).toLocaleString()}</span>
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
                            <span className="text-[13px] font-bold text-ink leading-tight">{new Date(rental.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="h-4 w-px bg-line/40" />
                        <div className="flex items-center gap-3 text-right">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Return</span>
                            <span className="text-[13px] font-bold text-ink leading-tight">{new Date(rental.return_date || rental.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          </div>
                          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm border border-line/40">
                            <Calendar className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-ink truncate max-w-[220px]">{rental.products?.[0]?.name || 'Gear Rental'}</span>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{(rental.products || []).length} Items Total</span>
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
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Detailed Items</span>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{(rental.products || []).length} Items</span>
                              </div>
                              {(rental.products || []).map((item: any, idx: number) => (
                                <div key={idx} className="group/item relative p-4 rounded-2xl border border-line/40 bg-white shadow-sm hover:border-primary/30 transition-all flex items-start gap-4">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-line shadow-sm shrink-0" />
                                  ) : (
                                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                      <ImageIcon className="h-6 w-6 text-slate-300" />
                                    </div>
                                  )}
                                  <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[13px] font-black text-ink leading-tight truncate">{item.name}</span>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                      {item.unique_code && (
                                        <span className="text-[10px] font-mono font-bold text-muted bg-slate-50 px-2 py-0.5 rounded border border-line uppercase">{item.unique_code}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-20 text-right flex-shrink-0 pt-0.5">
                                    <span className="text-[14px] font-black text-ink tabular-nums">₹{Number(item.price * (item.qty || 1)).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
      {activeTab === 'details' && (
        <>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {!verified && !blocked && (
              <button
                type="button"
                onClick={() => setConfirmType('verify')}
                disabled={isUpdating}
                className="pill-button border border-success/20 bg-success/10 text-success hover:bg-success hover:text-white disabled:opacity-50 sm:col-span-2"
              >
                <UserRoundCheck className="mr-2 h-4 w-4" />
                Verify Account
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirmType('block')}
              disabled={isUpdating}
              className={`pill-button border ${blocked ? 'border-success/20 bg-success/10 text-success hover:bg-success' : 'border-warning/20 bg-warning/10 text-warning hover:bg-warning'} hover:text-white disabled:opacity-50`}
            >
              {blocked ? 'Unblock User' : 'Block User'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmType('delete')}
              disabled={isUpdating}
              className="pill-button border border-danger/20 bg-danger/5 text-danger hover:bg-danger hover:text-white disabled:opacity-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </button>
          </div>

          <ConfirmModal
            isOpen={confirmType !== null}
            onClose={() => setConfirmType(null)}
            onConfirm={onConfirmAction}
            loading={isUpdating}
            tone={confirmType === 'delete' ? 'danger' : confirmType === 'block' ? 'warning' : 'success'}
            title={
              confirmType === 'delete' ? 'Delete User?' :
                confirmType === 'block' ? (blocked ? 'Unblock User?' : 'Block User?') :
                  'Verify User?'
            }
            message={
              confirmType === 'delete' ? 'This action is permanent and will remove all user data and rental history. Are you sure?' :
                confirmType === 'block' ? (blocked ? 'This will allow the user to log in and rent gear again.' : 'This will prevent the user from logging in or placing new rentals.') :
                  'This will mark the user as verified and allow them to rent gear. Have you verified their documents?'
            }
            confirmLabel={
              confirmType === 'delete' ? 'Delete Permanently' :
                confirmType === 'block' ? (blocked ? 'Unblock' : 'Block User') :
                  'Verify & Accept'
            }
          />
        </>
      )}
    </div>

  );
};

export default UserDetail;
