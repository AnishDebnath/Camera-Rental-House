import { Camera, Calendar, ArrowRight } from 'lucide-react';
import formatDate from '../../utils/formatDate';

interface ActiveRentalsTabProps {
  activeRentals: any[];
}

const ActiveRentalsTab = ({ activeRentals }: ActiveRentalsTabProps) => {
  return (
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
        <div className="grid gap-3 lg:grid-cols-2 md:gap-4">
          {activeRentals.map((rental) => {
            const isReleased = rental.rental_items.some(
              (item: any) => item.status === 'released',
            );

            return (
              <article
                key={rental.id}
                className="group card-surface flex flex-col rounded-[2rem] border border-white/60 bg-white/40 pt-4 px-4 pb-2.5 backdrop-blur-xl transition-all duration-300 md:pt-5 md:px-5 md:pb-3"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white shadow-sm backdrop-blur-md">
                    <span className={`h-1.5 w-1.5 rounded-full ${isReleased ? 'bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-primary animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.5)]'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Order #{rental.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                      {Math.ceil((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) || 1} Days
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pickup</p>
                      <p className="text-sm md:text-base font-bold text-ink leading-tight truncate">{formatDate(rental.pickup_date)}</p>
                    </div>
                    <div className="flex-shrink-0 text-slate-300 flex items-center justify-center h-8 w-8 rounded-full bg-white/50 border border-white shadow-sm">
                      <ArrowRight className="h-4 w-4 text-primary/40" />
                    </div>
                    <div className="flex-1 space-y-1 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Return</p>
                      <p className="text-sm md:text-base font-bold text-ink leading-tight truncate">{formatDate(rental.event_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${isReleased ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]'}`} />
                    <p className="text-[10px] font-semibold text-slate-500">
                      {isReleased ? 'Return to Rental House' : 'Pickup at Rental House'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 border-t border-slate-200/80 pt-3.5">
                  <div className="space-y-2.5">
                    {rental.rental_items.slice(0, 2).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-line/40 bg-white/50">
                          {item.products?.product_images?.[0]?.url ? (
                            <img
                              src={item.products.product_images[0].url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Camera className="h-4 w-4 text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-ink">
                            {item.products?.name || 'Unknown Product'}
                          </p>
                          <p className="text-[10px] font-medium text-muted">
                            {item.products?.brand || 'Premium Equipment'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {rental.rental_items.length > 2 && (
                      <p className="pl-13 text-[10px] font-bold text-primary">
                        + {rental.rental_items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    {/* Totals Card */}
                    <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 border border-white backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Units</p>
                        <p className="text-[11px] font-bold text-ink">{rental.rental_items.length} Items</p>
                      </div>
                      {rental.total_amount && (
                        <div className="space-y-0.5 text-right">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Total Amount</p>
                          <p className="text-[13px] md:text-sm font-black tracking-tight text-primary">₹{rental.total_amount.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {/* Handover Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-slate-50/80 p-3 border border-slate-100 transition-colors">
                        {isReleased ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
                              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Released By</p>
                            </div>
                            <p className="text-xs font-bold text-slate-800">{rental.released_by || 'Demo Admin'}</p>
                            <p className="text-[10px] font-medium text-slate-400">{rental.released_at ? formatDate(rental.released_at) : formatDate(rental.pickup_date)}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse" />
                              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600">Status</p>
                            </div>
                            <p className="text-xs font-bold text-amber-900">Awaiting Pickup</p>
                            <p className="text-[10px] font-medium text-amber-600/70">Not released yet</p>
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl bg-slate-50/80 p-3 border border-slate-100 transition-colors">
                        {rental.received_by ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Received By</p>
                            </div>
                            <p className="text-xs font-bold text-slate-800">{rental.received_by}</p>
                            <p className="text-[10px] font-medium text-slate-400">{rental.received_at ? formatDate(rental.received_at) : formatDate(new Date().toISOString())}</p>
                          </div>
                        ) : isReleased ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                              <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Status</p>
                            </div>
                            <p className="text-xs font-bold text-blue-900">In Possession</p>
                            <p className="text-[10px] font-medium text-blue-600/70">To be returned</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                            </div>
                            <p className="text-xs font-bold text-slate-500">Pending</p>
                            <p className="text-[10px] font-medium text-slate-400/60">—</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ActiveRentalsTab;
