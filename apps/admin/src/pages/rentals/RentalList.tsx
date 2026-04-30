import { Phone, Package, Calendar } from 'lucide-react';

type RentalListProps = {
  rentals: any[];
};

const RentalList = ({ rentals }: RentalListProps) => {
  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'upcoming') return 'bg-sky-50 text-sky-600';
    if (s === 'released' || s === 'active') return 'bg-amber-50 text-amber-600';
    if (s === 'returned' || s === 'completed') return 'bg-emerald-50 text-emerald-600';
    return 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="space-y-3">
      {rentals.map((rental) => (
        <article key={rental.id} className="card-surface p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-ink truncate">{rental.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${getStatusStyle(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="inline-flex items-center rounded border border-line bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                      <span className="mr-1 text-[8px] font-black uppercase text-tertiary/70">ID:</span>
                      {rental.id}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
                      <Phone className="h-3 w-3" />
                      {rental.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm font-bold text-ink">
                <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                <p className="line-clamp-2">{rental.items}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-[420px]">
              <div className="rounded-xl border border-line bg-white p-2.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-tertiary flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" /> Pickup
                </p>
                <p className="mt-1 text-xs font-bold text-ink">{rental.pickup}</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-2.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-tertiary flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" /> Event
                </p>
                <p className="mt-1 text-xs font-bold text-ink">{rental.event}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <button className="flex h-full w-full items-center justify-center rounded-xl bg-ink text-xs font-bold text-white transition hover:bg-sky-500">
                  Manage Order
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default RentalList;
