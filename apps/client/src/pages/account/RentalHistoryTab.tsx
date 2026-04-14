import { CalendarDays, PackageSearch } from 'lucide-react';
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
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-success/10 text-success border border-success/20">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted">
                      Order #{rental.id.slice(0, 8)}
                    </p>
                    <h3 className="text-base md:text-lg font-bold text-ink">
                      {formatDate(rental.pickup_date)}{' '}
                      <span className="mx-0.5 text-xs md:text-sm font-medium text-muted">to</span>{' '}
                      {formatDate(rental.event_date)}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line/40 pt-3 md:gap-8 md:border-t-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider">Items</p>
                    <p className="text-xs md:text-sm font-semibold text-ink">
                      {rental.rental_items.length} returned
                    </p>
                  </div>
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
