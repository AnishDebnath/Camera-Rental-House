import { useState, useMemo } from 'react';
import {
  Search,
  ScanLine,
  PackageCheck,
  UserCheck,
  Camera,
  CheckCircle2,
  ArrowLeft,
  X,
  QrCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminRentals } from '../data/mockAdmin';

const ReleaseReturn = () => {
  const [searchId, setSearchId] = useState('');
  const [activeRental, setActiveRental] = useState<any>(null);
  const [scannedProducts, setScannedProducts] = useState<string[]>([]);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find rental from mock data
  const handleSearch = () => {
    setError(null);
    const all = [
      ...adminRentals.upcoming,
      ...adminRentals.active,
      ...adminRentals.returning
    ];
    const found = all.find(r => r.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setActiveRental(found);
    } else {
      setError("Booking ID not found. Please verify and try again.");
    }
  };

  const toggleProductScan = (productId: string) => {
    setScannedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const allProductsScanned = activeRental?.products.every((p: any) => scannedProducts.includes(p.id));

  const handleReset = () => {
    setActiveRental(null);
    setSearchId('');
    setScannedProducts([]);
    setIsUserVerified(false);
    setProofPhoto(null);
    setIsComplete(false);
    setError(null);
  };

  if (isComplete) {
    return (
      <div className="admin-shell flex min-h-[80vh] items-center justify-center py-10 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center card-surface p-6"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Handover Success</h2>
          <p className="mt-3 text-sm font-medium text-muted leading-relaxed">
            Rental <span className="text-ink font-bold">{activeRental.id}</span> has been officially released to <span className="text-ink font-bold">{activeRental.name}</span>.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={handleReset}
              className="primary-button w-full"
            >
              Start New Handoff
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-shell py-8">
      {/* Header Part - Only show when record found */}
      {activeRental && (
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Release Gear</h1>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
              Verify products and user identity for secure gear handoff.
            </p>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        {!activeRental ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex min-h-[70vh] flex-col items-center justify-center text-center"
          >

            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-primary shadow-card border border-line">
              <span className="relative">
                <ScanLine className="h-10 w-10" />
                <motion.div
                  className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/40"
                  animate={{ top: ['20%', '80%', '20%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink">Search Rental Record</h2>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">Scan customer booking QR or enter ID manually.</p>

            <div className="mt-10 w-full max-w-lg space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Booking ID (e.g. RN-2041)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 placeholder:text-muted/50"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="h-12 w-full shrink-0 rounded-xl bg-ink px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-900 active:scale-95 sm:w-auto"
                >
                  View Details
                </button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-rose-500 font-bold text-sm"
                >
                  <AlertCircle className="h-4 w-4" /> {error}
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Left Column: Verification Steps */}
            <div className="lg:col-span-7 space-y-5">
              {/* Product Step */}
              <section className="card-surface p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-sm border border-sky-100">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-ink">Step 1 — Products</h3>
                      <p className="text-xs font-medium text-muted mt-0.5">Scan each item code to confirm availability</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-primary">
                      {scannedProducts.length} / {activeRental.products.length}
                    </span>
                    <div className="mt-1.5 h-1 w-24 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(scannedProducts.length / activeRental.products.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {activeRental.products.map((p: any) => {
                    const isScanned = scannedProducts.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`group relative flex items-center justify-between rounded-xl border p-3 transition-all duration-300 ${isScanned ? 'border-emerald-200 bg-emerald-50/20' : 'border-line bg-white hover:border-line-hover'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-line bg-slate-50">
                            <img src={p.image} className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                            {isScanned && (
                              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
                                <div className="rounded-full bg-emerald-500 p-1 text-white shadow-lg">
                                  <CheckCircle2 className="h-3 w-3" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ink">{p.name}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                                {p.id.toUpperCase()}
                              </span>
                              <span className="text-xs font-medium text-muted">× {p.qty}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleProductScan(p.id)}
                          className={`flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-all active:scale-95 ${isScanned ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-ink border border-line hover:bg-slate-100'}`}
                        >
                          <QrCode className="h-4 w-4" />
                          {isScanned ? 'Verified' : 'Verify Code'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* User Step */}
              <section className="card-surface p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-ink">Step 2 — User Identity</h3>
                    <p className="text-xs font-medium text-muted mt-0.5">Scan customer ID or QR to match booking</p>
                  </div>
                </div>

                <div className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${isUserVerified ? 'border-emerald-200 bg-emerald-50/20' : 'border-line bg-white shadow-sm'}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative h-20 w-20 shrink-0">
                        <div className="h-full w-full overflow-hidden rounded-xl border border-line shadow-sm">
                          <img src={activeRental.user_image} className="h-full w-full object-cover" />
                        </div>
                        {isUserVerified && (
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg border-2 border-white">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-base font-bold text-ink">{activeRental.name}</p>
                        <p className="mt-0.5 text-sm font-medium text-muted">{activeRental.phone}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex h-5 items-center rounded-full bg-slate-100 px-3 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
                            Customer
                          </span>
                          {isUserVerified && (
                            <span className="inline-flex h-5 items-center rounded-full bg-emerald-500/10 px-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                              Verified Record
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsUserVerified(!isUserVerified)}
                      className={`h-11 rounded-xl px-6 text-sm font-semibold transition-all active:scale-95 ${isUserVerified ? 'bg-emerald-500 text-white' : 'bg-ink text-white hover:bg-slate-900'}`}
                    >
                      {isUserVerified ? 'Identity Match ✓' : 'Scan to Verify'}
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Evidence & Submission */}
            <div className="lg:col-span-5 space-y-5">
              {/* Proof Step */}
              <section className="card-surface p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-ink">Step 3 — Handover Proof</h3>
                    <p className="text-xs font-medium text-muted mt-0.5">Capture live photo of user with products</p>
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-slate-50/50 group">
                  {proofPhoto ? (
                    <div className="relative h-full w-full group">
                      <img src={proofPhoto} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={() => setProofPhoto(null)}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg transition-transform hover:scale-110 active:scale-90"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-center p-8">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-card text-muted/30 border border-line/40">
                        <Camera className="h-10 w-10" />
                      </div>
                      <p className="text-sm font-semibold text-ink">Ready for Capture</p>
                      <p className="mt-2 text-xs font-medium text-muted leading-relaxed max-w-[180px]">Take a live picture for handover insurance and verification.</p>
                      <button
                        onClick={() => setProofPhoto("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80")}
                        className="mt-6 secondary-button w-full"
                      >
                        Click Live Picture
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Checklist Summary & Action */}
              <div className="space-y-4">
                <div className="card-surface p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-5">Process Status</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Products Verified', status: allProductsScanned },
                      { label: 'Identity Matched', status: isUserVerified },
                      { label: 'Photo Evidence', status: !!proofPhoto }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">{item.label}</span>
                        <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${item.status ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {item.status ? (
                            <>DONE <CheckCircle2 className="h-4 w-4" /></>
                          ) : (
                            <>PENDING <div className="h-1.5 w-1.5 rounded-full bg-slate-200" /></>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!allProductsScanned || !isUserVerified || !proofPhoto}
                  onClick={() => setIsComplete(true)}
                  className="primary-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Release Equipment
                </button>

                <button
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Reset Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReleaseReturn;
