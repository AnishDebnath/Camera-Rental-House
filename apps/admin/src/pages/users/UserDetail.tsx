import { Ban, Trash2, UserRoundCheck, Loader2, Instagram, Facebook, Youtube, UserRound, IdCard, ExternalLink, ArrowLeft, Phone, Mail, Calendar, ShoppingCart, IndianRupee, Hash, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';

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
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to update block status.', tone: 'error' });
    } finally {
      setIsUpdating(false);
    }
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
        <div className="card-surface space-y-4 p-6">
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

        <span
          className={`md:hidden inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-[10px] font-bold shadow-sm ${
            blocked ? 'bg-danger/10 text-danger' : 
            !verified ? 'bg-warning/10 text-warning' : 
            'bg-success/10 text-success'
          }`}
        >
          {blocked ? <Ban className="h-3.5 w-3.5" /> : !verified ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          <span className="leading-none uppercase tracking-wider">{blocked ? 'Blocked' : !verified ? 'Review Pending' : 'Verified'}</span>
        </span>
      </div>

      <section className="card-surface space-y-5 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-stretch gap-4 h-16">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className={`h-full aspect-square shrink-0 rounded-xl object-cover shadow-sm border-2 transition-all ${isChanged('avatar_url') ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-white'}`}
              />
            ) : (
              <span className={`flex h-full aspect-square shrink-0 items-center justify-center rounded-xl bg-primary-light text-xl font-bold text-ink shadow-sm transition-all ${isChanged('avatar_url') ? 'ring-2 ring-amber-400' : ''}`}>
                {user.full_name?.split(' ').map((part: string) => part[0]).slice(0, 2).join('')}
              </span>
            )}
            <div className="flex flex-col justify-between py-0.5">
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-none transition-all ${isChanged('full_name') ? 'text-amber-600' : ''}`}>{user.full_name}</h1>
                {isChanged('full_name') && (
                  <span className="inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                    Changed
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-1.5 rounded-lg border border-primary/10 bg-primary/5 px-2.5 py-1 text-primary shadow-sm">
                  <IdCard className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] leading-none mt-0.5">{user.member_id || 'PENDING'}</span>
                </div>
              </div>
            </div>
          </div>

          <span
            className={`hidden md:inline-flex items-center gap-2 rounded-pill px-4 py-2 text-xs font-bold ${
              blocked ? 'bg-danger/10 text-danger' : 
              !verified ? 'bg-warning/10 text-warning' : 
              'bg-success/10 text-success'
            }`}
          >
            {blocked ? <Ban className="h-4 w-4" /> : !verified ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            <span className="leading-none uppercase tracking-wider">{blocked ? 'Blocked' : !verified ? 'Review Pending' : 'Verified'}</span>
          </span>
        </div>
      </section>

      <div className="space-y-4 md:space-y-6">
        <section className="card-surface p-5 md:p-6">
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

        <section className="card-surface p-5 md:p-6">
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

        <section className="card-surface p-5 md:p-6">
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
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {!verified && !blocked && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={isUpdating}
            className="pill-button border border-success/20 bg-success/10 text-success hover:bg-success hover:text-white disabled:opacity-50 sm:col-span-2"
          >
            <UserRoundCheck className="mr-2 h-4 w-4" />
            Verify Account
          </button>
        )}
        <button
          type="button"
          onClick={handleBlock}
          disabled={isUpdating}
          className={`pill-button border ${blocked ? 'border-success/20 bg-success/10 text-success hover:bg-success' : 'border-warning/20 bg-warning/10 text-warning hover:bg-warning'} hover:text-white disabled:opacity-50`}
        >
          {blocked ? 'Unblock User' : 'Block User'}
        </button>
        <button
          type="button"
          onClick={() => setDeleted(true)}
          disabled={isUpdating}
          className="pill-button border border-danger/20 bg-danger/5 text-danger hover:bg-danger hover:text-white disabled:opacity-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
