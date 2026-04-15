import { CalendarDays, PackageSearch, Camera, Calendar } from 'lucide-react';
import formatDate from '../../utils/formatDate';

interface RentalHistoryTabProps {
  pastRentals: any[];
}

const RentalHistoryTab = ({ pastRentals }: RentalHistoryTabProps) => {
  return (
    <section className="animate-fade-up space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-line/40 pb-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-ink">Rental History</h2>
          <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
            Your past orders and returned inventory.
          </p>
        </div>
        <div className="w-fit rounded-full border border-success/20 bg-success/10 px-4 py-1.5 text-[10px] md:text-xs font-bold text-success backdrop-blur-sm">
          {pastRentals.length} past order{pastRentals.length !== 1 ? 's' : ''}
        </div>
      </div>

      {pastRentals.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center space-y-4 rounded-[2rem] border-2 border-dashed border-white/60 bg-white/40 p-10 text-center backdrop-blur-sm md:p-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <PackageSearch className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-bold text-ink">No past rentals</h3>
            <p className="text-xs md:text-sm font-medium text-muted">
              Your rental history will appear here once an order is completed.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {pastRentals.map((rental) => (
            <article
              key={rental.id}
              className="card-surface rounded-[2rem] border border-white/60 bg-white/40 p-5 backdrop-blur-xl transition-all duration-300"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden ml-1">
                    {rental.rental_items.slice(0, 3).map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white/50 shadow-sm"
                      >
                        {item.products?.product_images?.[0]?.url ? (
                          <img
                            src={item.products.product_images[0].url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <Camera className="h-3 w-3 text-muted" />
                          </div>
                        )}
                      </div>
                    ))}
                    {rental.rental_items.length > 3 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary-light text-[10px] font-bold text-primary shadow-sm">
                        +{rental.rental_items.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted">
                      Order #{rental.id.slice(0, 8)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted" />
                        <span className="text-base md:text-lg font-bold text-ink leading-tight">
                          {formatDate(rental.pickup_date)}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm font-medium text-muted lowercase">to</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted" />
                        <span className="text-base md:text-lg font-bold text-ink leading-tight">
                          {formatDate(rental.event_date)}
                        </span>
                      </div>
                      <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-muted border border-slate-200">
                        {Math.ceil((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) || 1} Days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line/40 pt-3 md:gap-10 md:border-t-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider">Items</p>
                    <p className="text-xs md:text-sm font-bold text-ink">
                      {rental.rental_items.length} units
                    </p>
                  </div>
                  {rental.total_amount && (
                    <div className="text-left md:text-right">
                      <p className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider">Amount</p>
                      <p className="text-xs md:text-sm font-bold text-primary">
                        ₹{rental.total_amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <span className="rounded-full border border-success/20 bg-success/5 px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-success">
                    Completed
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default RentalHistoryTab;
