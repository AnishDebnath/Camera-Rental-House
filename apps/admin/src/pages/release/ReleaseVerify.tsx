import {
  PackageCheck,
  UserCheck,
  Camera,
  CheckCircle2,
  ArrowLeft,
  X,
  QrCode,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  rental: any;
  scannedProducts: string[];
  onToggleScan: (id: string) => void;
  isUserVerified: boolean;
  onToggleVerify: () => void;
  proofPhoto: string | null;
  onCapture: () => void;
  onClearPhoto: () => void;
  onRelease: () => void;
  onReset: () => void;
}

const ReleaseVerify = ({
  rental,
  scannedProducts,
  onToggleScan,
  isUserVerified,
  onToggleVerify,
  proofPhoto,
  onCapture,
  onClearPhoto,
  onRelease,
  onReset,
}: Props) => {
  const allProductsScanned = rental.products.every((p: any) => scannedProducts.includes(p.id));

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid gap-6 lg:grid-cols-12"
    >
      {/* Left Column */}
      <div className="lg:col-span-7 space-y-5">
        {/* Step 1: Products */}
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
                {scannedProducts.length} / {rental.products.length}
              </span>
              <div className="mt-1.5 h-1 w-24 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(scannedProducts.length / rental.products.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {rental.products.map((p: any) => {
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
                    onClick={() => onToggleScan(p.id)}
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

        {/* Step 2: User Identity */}
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
                    <img src={rental.user_image} className="h-full w-full object-cover" />
                  </div>
                  {isUserVerified && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg border-2 border-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-ink">{rental.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-muted">{rental.phone}</p>
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
                onClick={onToggleVerify}
                className={`h-11 rounded-xl px-6 text-sm font-semibold transition-all active:scale-95 ${isUserVerified ? 'bg-emerald-500 text-white' : 'bg-ink text-white hover:bg-slate-900'}`}
              >
                {isUserVerified ? 'Identity Match ✓' : 'Scan to Verify'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-5 space-y-5">
        {/* Step 3: Proof */}
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
                  onClick={onClearPhoto}
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
                <p className="mt-2 text-xs font-medium text-muted leading-relaxed max-w-[180px]">
                  Take a live picture for handover insurance and verification.
                </p>
                <button onClick={onCapture} className="mt-6 secondary-button w-full">
                  Click Live Picture
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Checklist & Release */}
        <div className="space-y-4">
          <div className="card-surface p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-5">Process Status</h4>
            <div className="space-y-4">
              {[
                { label: 'Products Verified', status: allProductsScanned },
                { label: 'Identity Matched', status: isUserVerified },
                { label: 'Photo Evidence', status: !!proofPhoto },
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
            onClick={onRelease}
            className="primary-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Release Equipment
          </button>

          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Reset Session
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReleaseVerify;
