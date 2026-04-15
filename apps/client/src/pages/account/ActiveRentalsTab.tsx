import { Camera, ChevronRight, Calendar } from 'lucide-react';
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
        <div className="grid gap-4 lg:grid-cols-2 md:gap-6">
          {activeRentals.map((rental) => {
            const isReleased = rental.rental_items.some(
              (item: any) => item.status === 'released',
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
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span className="text-base md:text-lg font-bold text-ink leading-tight">
                            {formatDate(rental.pickup_date)}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-muted lowercase">to</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base md:text-lg font-bold text-ink leading-tight">
                            {formatDate(rental.event_date)}
                          </span>
                        </div>
                        <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {Math.ceil((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) || 1} Days
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs font-semibold text-muted flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {isReleased ? 'Return to Rental House' : 'Pickup at Rental House'}
                      </p>
                    </div>
                  </div>
                  {/* <span
                    className={`rounded-full border px-3.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider ${isReleased
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                  >
                    {isReleased ? 'Released' : 'Pending'}
                  </span> */}
                </div>

                <div className="mb-4 flex-1 space-y-4 border-t border-line/40 pt-4">
                  <div className="space-y-3">
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

                  <div className="space-y-2 border-t border-line/20 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Items</span>
                      <span className="text-xs font-bold text-ink">{rental.rental_items.length} units</span>
                    </div>
                    {rental.total_amount && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Amount</span>
                        <span className="text-xs md:text-sm font-bold text-primary">₹{rental.total_amount.toLocaleString()}</span>
                      </div>
                    )}
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
  );
};

export default ActiveRentalsTab;
