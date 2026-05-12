import { UserCheck, CheckCircle2, Phone, UserPlus } from 'lucide-react';

interface Props {
  user: {
    id: string;
    name: string;
    phone: string;
    image: string;
  };
  isVerified: boolean;
  onToggleVerify: () => void;
  representativeName: string;
  setRepresentativeName: (name: string) => void;
  isHouseBooking?: boolean;
}

const Step2UserIdentity = ({ 
  user, 
  isVerified, 
  onToggleVerify,
  representativeName,
  setRepresentativeName,
  isHouseBooking
}: Props) => {
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
                {user.image ? (
                  <img src={user.image} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                    <UserCheck className="h-8 w-8" />
                  </div>
                )}
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg border-2 border-white">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="text-base font-black text-ink tracking-tight break-words leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />
                <p className="text-sm font-bold text-muted tracking-tight truncate">{user.phone}</p>
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

        {/* Representative Input for Production House Bookings */}
        {isHouseBooking && (
          <div className="mt-6 border-t border-line/60 pt-6 animate-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-3 mb-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                 <UserPlus className="h-4 w-4" />
               </div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-ink">Handover Representative</h4>
             </div>
             <div className="relative">
               <input 
                 type="text" 
                 value={representativeName}
                 onChange={(e) => setRepresentativeName(e.target.value)}
                 placeholder="Enter full name of person collecting gear..."
                 className="w-full rounded-xl border-line bg-slate-50/50 px-4 py-3 text-sm font-bold text-ink placeholder:text-muted/40 focus:bg-white focus:ring-primary transition-all"
               />
             </div>
             <p className="mt-2 text-[10px] font-bold text-muted leading-relaxed">
               As this is a production house booking, please specify the representative who is physically receiving the products.
             </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Step2UserIdentity;
