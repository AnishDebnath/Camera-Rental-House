import { UserCheck, CheckCircle2, Phone } from 'lucide-react';

interface Props {
  user: {
    id: string;
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
          <p className="text-xs font-medium text-muted mt-0.5">Scan user ID or QR to match booking</p>
        </div>
      </div>

      <div
        className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ${isVerified
          ? 'border-emerald-200 bg-emerald-50/40 shadow-sm'
          : 'border-line bg-white shadow-sm hover:shadow-md'
          }`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className={`h-16 w-16 overflow-hidden rounded-2xl border transition-all duration-500 ${isVerified ? 'border-emerald-500/30' : 'border-line shadow-sm'
                }`}>
                <img src={user.image} className="h-full w-full object-cover" />
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg border-2 border-white">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-black text-ink tracking-tight">{user.name}</p>
                {isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/20">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                <p className="text-sm font-bold text-muted tracking-tight">{user.phone}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleVerify}
            disabled={isVerified}
            className={`relative h-12 overflow-hidden rounded-xl px-8 text-xs font-black uppercase tracking-widest transition-all duration-300 ${isVerified
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 cursor-default pointer-events-none'
              : 'bg-ink text-white hover:bg-slate-900 shadow-xl active:scale-95'
              }`}
          >
            {isVerified ? 'Verified ✓' : 'Verify Profile'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Step2UserIdentity;
