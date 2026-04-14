import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  IdCard,
  LogOut,
  PackageSearch,
  Pencil,
  Phone,
  QrCode,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';
import formatDate from '../utils/formatDate';
import { resolveAuthAppUrl } from '../../../../packages/auth/appUrls';
import { useLenis } from '../context/LenisContext';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const TABS = [
  { id: 'details', label: 'Account Details', icon: UserRound },
  { id: 'active', label: 'Active Rentals', icon: Camera },
  { id: 'history', label: 'Rental History', icon: PackageSearch },
] as const;

type TabId = (typeof TABS)[number]['id'];

const Account = () => {
  const { user, rentals, refreshRentals, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const lenis = useLenis();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(user);
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [showQrFullScreen, setShowQrFullScreen] = useState(false);

  useEffect(() => {
    refreshRentals();
  }, []);

  useEffect(() => {
    setDraft(user);
  }, [user]);

  // Handle scroll lock (Lenis) when QR modal is open
  useEffect(() => {
    if (showQrFullScreen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => lenis?.start();
  }, [showQrFullScreen, lenis]);

  if (!user) {
    return null;
  }

  const activeRentals = rentals.filter((rental) =>
    rental.rental_items.some((item) => item.status !== 'returned'),
  );
  const pastRentals = rentals.filter((rental) =>
    rental.rental_items.every((item) => item.status === 'returned'),
  );

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    await updateProfile(draft);
    setLoading(false);
    setEditing(false);
  };

  const handleSignOut = () => {
    logout();
    window.location.replace(`${authAppUrl}/login`);
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Since Early 2024';

  return (
    <div className="page-animate app-shell space-y-6 pb-24 pt-4 md:space-y-8">
      {/* Refined Liquid Glass Profile Top Card */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/50 p-6 shadow-sm backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left text-center">

            {/* Avatar Group */}
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-white bg-gradient-to-br from-primary-light/50 to-blue-50/50 shadow-sm transition-transform duration-300 md:h-28 md:w-28 text-primary">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-10 w-10 md:h-12 md:w-12" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  {user.fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-muted sm:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-primary" />
                    +91 {user.phone}
                  </span>
                  <span className="hidden h-1 w-1 rounded-full bg-muted/40 sm:block" />
                  <span className="flex items-center gap-1.5 font-mono tracking-wider">
                    <IdCard className="h-4 w-4 text-primary" />ID:
                    {user.id?.slice(0, 8).toUpperCase() || 'USER'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-full border border-danger/20 bg-danger/5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-danger transition-colors hover:bg-danger hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>

          </div>

          <div className="hidden h-24 w-px rounded-full bg-line/60 md:block" />

          {/* Premium QR Code Section */}
          <div
            className="group relative flex cursor-pointer items-center justify-center rounded-[1.8rem] bg-white/40 p-2.5 shadow-inner backdrop-blur-md transition-all duration-300 border border-white/60 hover:bg-white/60 hover:shadow-sm"
            onClick={() => setShowQrFullScreen(true)}
          >
            <div className="flex items-center gap-4 pr-4 pl-1 min-w-[200px]">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-sm border border-line transition-transform duration-300 group-hover:scale-105">
                <img
                  src={user.userQrBase64}
                  alt="QR"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <p className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-ink whitespace-nowrap">
                  <QrCode className="h-4 w-4 text-primary" />
                  Rental QR
                </p>
                <p className="text-[10px] md:text-xs font-semibold text-muted">
                  Tap to display
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex w-full overflow-x-auto rounded-full border border-white/60 bg-white/40 p-1.5 shadow-sm backdrop-blur-md hide-scrollbar md:w-fit md:min-w-[420px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex min-w-[max-content] flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-xs md:text-sm font-bold transition-all duration-300 ${isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:bg-white/60 hover:text-ink'
                }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Account Details */}
      {activeTab === 'details' && (
        <section className="animate-fade-up">
          <div className="card-surface rounded-[2rem] border border-white/60 bg-white/40 p-5 backdrop-blur-xl md:p-8 space-y-6 md:space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-1.5 text-lg md:text-xl font-bold text-ink">
                  <UserRound className="h-5 w-5 text-primary" />
                  Personal Information
                </h2>
                <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
                  Manage your account details and contact information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing((current) => !current)}
                className="secondary-button !h-10 !px-6 !text-xs md:!text-sm whitespace-nowrap bg-white/80"
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {[
                ['Full name', 'fullName', 'text'],
                ['Phone Number', 'phone', 'tel'],
                ['Email Address', 'email', 'email'],
                ['Aadhaar Number', 'aadhaarNo', 'text'],
                ['Voter ID', 'voterNo', 'text'],
                ['Facebook Profile', 'facebook', 'url'],
                ['Instagram Profile', 'instagram', 'url'],
                ['YouTube Channel', 'youtube', 'url'],
              ].map(([label, key, type]) => (
                <div key={key} className="group space-y-1.5">
                  <label className="ml-1 text-[10px] md:text-xs font-bold tracking-widest text-tertiary transition-colors group-focus-within:text-primary uppercase">
                    {label}
                  </label>
                  <div
                    className={`input-shell !h-12 !min-h-0 border border-white/60 bg-white/50 backdrop-blur-sm transition-all duration-200 md:!h-13 ${!editing ? 'border-transparent bg-transparent opacity-80 shadow-none px-1' : ''
                      }`}
                  >
                    <input
                      disabled={!editing}
                      type={type}
                      value={(draft as any)?.[key] || ''}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, [key]: event.target.value }) as any)
                      }
                      className="w-full border-0 bg-transparent p-0 text-xs md:text-sm font-bold text-ink placeholder:text-muted/50 focus:ring-0 disabled:text-ink"
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {editing && (
              <div className="flex pt-2 md:pt-4">
                <LoadingButton
                  loading={loading}
                  onClick={handleSave}
                  className="!h-12 !min-h-0 w-full rounded-xl text-xs md:text-sm font-bold sm:w-fit sm:px-12"
                >
                  Save Changes
                </LoadingButton>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab Content: Active Rentals */}
      {activeTab === 'active' && (
        <section className="animate-fade-up space-y-4 md:space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-line/40 pb-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-ink">Active Rentals</h2>
              <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
                Currently ongoing or upcoming booked rentals.
              </p>
            </div>
            <div className="w-fit rounded-full border border-primary/20 bg-primary-light/50 px-4 py-1.5 text-[10px] md:text-xs font-bold text-primary-dark backdrop-blur-sm">
              {activeRentals.length} active order{activeRentals.length !== 1 ? 's' : ''}
            </div>
          </div>

          {activeRentals.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center space-y-4 rounded-[2rem] border-2 border-dashed border-white/60 bg-white/40 p-10 text-center backdrop-blur-sm md:p-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
                <Camera className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-bold text-ink">No active rentals</h3>
                <p className="text-xs md:text-sm font-medium text-muted">
                  You don't have any ongoing or upcoming rentals.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {activeRentals.map((rental) => {
                const isReleased = rental.rental_items.some(
                  (item) => item.status === 'released',
                );

                return (
                  <article
                    key={rental.id}
                    className="group card-surface flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-5 backdrop-blur-xl transition-all duration-300 md:p-6"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                          Order #{rental.id.slice(0, 8)}
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-ink">
                          {formatDate(rental.pickup_date)}{' '}
                          <span className="mx-0.5 text-xs md:text-sm font-medium text-muted">to</span>{' '}
                          {formatDate(rental.event_date)}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full border px-3.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider ${isReleased
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                      >
                        {isReleased ? 'Released' : 'Pending'}
                      </span>
                    </div>

                    <div className="mb-4 flex-1 space-y-2 border-t border-line/40 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-ink">Total Items</span>
                        <span className="text-xs md:text-sm font-semibold text-muted">{rental.rental_items.length} units</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button className="group/btn flex items-center gap-1 text-xs md:text-sm font-bold text-primary transition-all hover:text-primary-dark">
                        View details <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab Content: Rental History */}
      {activeTab === 'history' && (
        <section className="animate-fade-up space-y-4 md:space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-line/40 pb-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-ink">Rental History</h2>
              <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
                Your past orders and returned inventory.
              </p>
            </div>
            <div className="w-fit rounded-full border border-success/20 bg-success/10 px-4 py-1.5 text-[10px] md:text-xs font-bold text-success backdrop-blur-sm">
              {pastRentals.length} past order{pastRentals.length !== 1 ? 's' : ''}
            </div>
          </div>

          {pastRentals.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center space-y-4 rounded-[2rem] border-2 border-dashed border-white/60 bg-white/40 p-10 text-center backdrop-blur-sm md:p-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
                <PackageSearch className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-bold text-ink">No past rentals</h3>
                <p className="text-xs md:text-sm font-medium text-muted">
                  Your rental history will appear here once an order is completed.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {pastRentals.map((rental) => (
                <article
                  key={rental.id}
                  className="card-surface rounded-[2rem] border border-white/60 bg-white/40 p-5 backdrop-blur-xl transition-all duration-300"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-success/10 text-success border border-success/20">
                        <CalendarDays className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted">
                          Order #{rental.id.slice(0, 8)}
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-ink">
                          {formatDate(rental.pickup_date)}{' '}
                          <span className="mx-0.5 text-xs md:text-sm font-medium text-muted">to</span>{' '}
                          {formatDate(rental.event_date)}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-line/40 pt-3 md:gap-8 md:border-t-0 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider">Items</p>
                        <p className="text-xs md:text-sm font-semibold text-ink">
                          {rental.rental_items.length} returned
                        </p>
                      </div>
                      <span className="rounded-full border border-success/20 bg-success/5 px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-success">
                        Completed
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* QR Code Full Screen Modal - Using Dialog for portal (covers navbar/bottomnav) */}
      <Transition.Root show={showQrFullScreen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[2000]"
          onClose={setShowQrFullScreen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            onEntered={() => lenis?.stop()}
            onExited={() => lenis?.start()}
          >
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[400px] overflow-hidden bg-white rounded-[2.5rem] shadow-2xl transition-all md:rounded-[3rem]">
                  {/* Top Close Button */}
                  <button
                    onClick={() => setShowQrFullScreen(false)}
                    className="absolute top-6 right-6 z-10 h-10 w-10 flex items-center justify-center bg-slate-50 border border-line rounded-full text-ink shadow-sm hover:bg-white hover:scale-105 transition-all active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* QR Card Content */}
                  <div className="p-8 pt-12 space-y-8 text-center bg-gradient-to-b from-primary/5 to-transparent">
                    {/* Header Info */}
                    <div className="space-y-2">
                      <Dialog.Title as="h2" className="text-2xl font-bold text-ink">
                        {user.fullName}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-muted font-mono tracking-tight">
                        <span className="flex items-center gap-1">
                          <IdCard className="h-3.5 w-3.5 text-primary" />
                          {user.id?.slice(0, 12).toUpperCase()}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-muted/40" />
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          {memberSince}
                        </span>
                      </div>
                    </div>

                    {/* QR Image with Border Effect */}
                    <div className="relative group mx-auto w-fit">
                      <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
                      <div className="relative p-5 bg-white border border-line rounded-[2rem] shadow-sm">
                        <img
                          src={user.userQrBase64}
                          alt="User QR Identity"
                          className="h-64 w-64 md:h-72 md:w-72 object-cover rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Footer Instruction */}
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-1">
                        <QrCode className="h-6 w-6 text-primary mb-1" />
                        <p className="text-sm font-bold text-ink">User Identity QR</p>
                        <p className="text-xs font-medium text-muted">Show this at the counter for quick verification</p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified Identity
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Account;
