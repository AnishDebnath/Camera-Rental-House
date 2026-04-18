import { useState } from 'react';
import { Camera, Calendar, ChevronDown, ChevronUp, PackageCheck, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import formatDate from '../../utils/formatDate';

interface RentalHistoryTabProps {
  pastRentals: any[];
}

const RentalHistoryTab = ({ pastRentals }: RentalHistoryTabProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="animate-fade-up space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-line/40 pb-3 px-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-ink">Rental History</h2>
          <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
            Your past orders and returned inventory.
          </p>
        </div>
        <div className="w-fit rounded-full border border-primary/20 bg-primary-light/50 px-4 py-1.5 text-[10px] md:text-xs font-bold text-primary-dark backdrop-blur-sm">
          {pastRentals.length} past order{pastRentals.length !== 1 ? 's' : ''}
        </div>
      </div>

      {pastRentals.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center space-y-4 rounded-[2rem] border-2 border-dashed border-white/60 bg-white/40 p-10 text-center backdrop-blur-sm md:p-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
            <PackageCheck className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-bold text-ink">No past rentals</h3>
            <p className="text-xs md:text-sm font-medium text-muted">
              Your rental history will appear here once an order is completed.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 md:gap-4">
          {pastRentals.map((rental) => {
            const isExpanded = expandedId === rental.id;
            const duration = Math.ceil((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) || 1;

            return (
              <article
                key={rental.id}
                className={`group card-surface flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-4 backdrop-blur-xl transition-all duration-300 md:p-5 ${isExpanded ? 'border-line/40 shadow-lg bg-white/60' : 'hover:shadow-md'}`}
              >
                {/* Header section - clicking anywhere toggles */}
                <div
                  className="flex cursor-pointer flex-col select-none"
                  onClick={() => toggleExpand(rental.id)}
                >
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white shadow-sm backdrop-blur-md">
                      <span className={`h-1.5 w-1.5 rounded-full ${rental.status === 'failed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Order #{rental.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${rental.status === 'failed' ? 'text-red-500' : 'text-success'}`}>
                        {rental.status === 'failed' ? 'Failed' : 'Completed'}
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/50 border border-white">
                        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pickup</p>
                        <p className="text-sm md:text-base font-bold text-ink leading-tight truncate">{formatDate(rental.pickup_date)}</p>
                      </div>
                      <div className="flex-shrink-0 text-slate-300 flex items-center justify-center h-8 w-8 rounded-full bg-white/50 border border-white shadow-sm">
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="flex-1 space-y-1 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Return</p>
                        <p className="text-sm md:text-base font-bold text-ink leading-tight truncate">{formatDate(rental.event_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-500">
                        Duration: {duration} Days
                      </span>
                    </div>
                  </div>

                  {/* Summary Totals Card */}
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
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4">
                        {/* Rented Gears List */}
                        <div className="flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink">
                            <Info className="h-3 w-3 text-primary" />
                            Item Details
                          </h4>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {rental.rental_items.map((item: any, idx: number) => {
                            const itemTotal = (item.price_per_day || 0) * duration;
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-3 rounded-2xl border border-line/20 bg-white/20 p-3 transition-colors hover:bg-white/40"
                              >
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line/40 bg-white/50">
                                  {item.products?.product_images?.[0]?.url ? (
                                    <img
                                      src={item.products.product_images[0].url}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-50">
                                      <Camera className="h-4 w-4 text-muted" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="truncate text-xs font-bold text-ink">
                                      {item.products?.name || 'Unknown Product'}
                                    </p>
                                    <p className="shrink-0 text-xs font-black text-primary">₹{itemTotal.toLocaleString()}</p>
                                  </div>
                                  <div className="mt-1 flex items-center justify-between">
                                    <p className="text-[10px] font-medium text-muted">
                                      {item.products?.brand || 'Premium Equipment'}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 italic">₹{item.price_per_day}/d × {duration}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Handover Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 mt-4">
                          <div className="rounded-2xl bg-slate-50/80 p-3 border border-slate-100 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Released By</p>
                              </div>
                              <p className="text-xs font-bold text-slate-800">{rental.released_by || 'Demo Admin'}</p>
                              <p className="text-[10px] font-medium text-slate-400">{rental.released_at ? formatDate(rental.released_at) : formatDate(rental.pickup_date)}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-slate-50/80 p-3 border border-slate-100 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Received By</p>
                              </div>
                              <p className="text-xs font-bold text-slate-800">{rental.received_by || 'Demo Admin'}</p>
                              <p className="text-[10px] font-medium text-slate-400">{rental.received_at ? formatDate(rental.received_at) : formatDate(rental.event_date)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RentalHistoryTab;



