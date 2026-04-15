import { useState } from 'react';
import { Camera, Calendar, ChevronDown, ChevronUp, PackageCheck, Info } from 'lucide-react';
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
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-line/40 pb-3">
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
        <div className="space-y-4">
          {pastRentals.map((rental) => {
            const isExpanded = expandedId === rental.id;
            const duration = Math.ceil((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) || 1;

            return (
              <article
                key={rental.id}
                className={`group card-surface flex flex-col rounded-[2rem] border-2 border-white/60 bg-white/40 p-5 backdrop-blur-xl transition-all duration-500 hover:border-primary/20 md:p-6 ${isExpanded ? 'ring-2 ring-primary/10 shadow-xl' : 'hover:shadow-lg'
                  }`}
              >
                {/* Header section - always visible */}
                <div
                  className="flex cursor-pointer flex-col gap-5 md:flex-row md:items-start md:justify-between"
                  onClick={() => toggleExpand(rental.id)}
                >
                  <div className="flex flex-1 items-start gap-4">
                    {/* Avatars section */}
                    <div className="hidden sm:flex -space-x-4 overflow-hidden mt-1">
                      {rental.rental_items.slice(0, 3).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-white bg-white/50 shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
                        >
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
                      ))}
                      {rental.rental_items.length > 3 && (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-primary-light text-xs font-bold text-primary shadow-sm">
                          +{rental.rental_items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary">
                          Order #{rental.id.slice(0, 8)}
                        </p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[8px] md:text-[10px] font-bold text-primary uppercase">
                          {duration} Days
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-base md:text-lg font-bold text-ink leading-none">
                            {formatDate(rental.pickup_date)}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-muted lowercase">to</span>
                        <span className="text-base md:text-lg font-bold text-ink leading-none">
                          {formatDate(rental.event_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Details in Card Header */}
                  <div className="flex flex-wrap items-center gap-4 border-t border-line/20 pt-4 md:flex-row md:items-center md:border-t-0 md:pt-0">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:items-center sm:gap-8">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Items</p>
                        <p className="text-sm font-bold text-ink">{rental.rental_items.length} Units</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Amount</p>
                        <p className="text-sm font-black text-primary">₹{rental.total_amount?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-0.5 sm:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Status</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto md:ml-2">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 space-y-4 border-t border-line/40 pt-6">
                        {/* Rented Gears List */}
                        <div className="flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink">
                            <Info className="h-3.5 w-3.5 text-primary" />
                            Item Details & Pricing
                          </h4>
                          {/* <span className="text-[10px] font-bold text-muted">Breakdown for {duration} days</span> */}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {rental.rental_items.map((item: any, idx: number) => {
                            const itemTotal = (item.price_per_day || 0) * duration;
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-3 rounded-2xl border border-line/20 bg-white/20 p-4 transition-all hover:bg-white/40"
                              >
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line/40 bg-white shadow-sm">
                                  {item.products?.product_images?.[0]?.url ? (
                                    <img
                                      src={item.products.product_images[0].url}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-50">
                                      <Camera className="h-5 w-5 text-muted" />
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
                                    <p className="text-[10px] font-semibold text-muted">
                                      {item.products?.brand || 'Premium Equipment'}
                                    </p>
                                    <p className="text-[9px] font-bold text-muted italic">₹{item.price_per_day}/day × {duration}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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



