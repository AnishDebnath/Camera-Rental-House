import { UserCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  user: {
    name: string;
    phone: string;
    image: string;
  };
  isVerified: boolean;
  onToggleVerify: () => void;
}

const Step2UserIdentity = ({ user, isVerified, onToggleVerify }: Props) => {
  return (
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

      <div
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
          isVerified ? 'border-emerald-200 bg-emerald-50/20' : 'border-line bg-white shadow-sm'
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <div className="h-full w-full overflow-hidden rounded-xl border border-line shadow-sm">
                <img src={user.image} className="h-full w-full object-cover" />
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg border-2 border-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            <div>
              <p className="text-base font-bold text-ink">{user.name}</p>
              <p className="mt-0.5 text-sm font-medium text-muted">{user.phone}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex h-5 items-center rounded-full bg-slate-100 px-3 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
                  Customer
                </span>
                {isVerified && (
                  <span className="inline-flex h-5 items-center rounded-full bg-emerald-500/10 px-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    Verified Record
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onToggleVerify}
            className={`h-11 rounded-xl px-6 text-sm font-semibold transition-all active:scale-95 ${
              isVerified ? 'bg-emerald-500 text-white' : 'bg-ink text-white hover:bg-slate-900'
            }`}
          >
            {isVerified ? 'Identity Match ✓' : 'Scan to Verify'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Step2UserIdentity;
