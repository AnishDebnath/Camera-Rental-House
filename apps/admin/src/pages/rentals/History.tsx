import { useState, useMemo } from 'react';
import { Search, History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminRentals } from '../../data/mockAdmin';
import RentalCard from './RentalCard';

const RentalHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine only finalized rentals for history
  const allHistory = useMemo(() => {
    const combined = [
      ...adminRentals.completed,
      ...adminRentals.cancelled
    ];
    // Sort by return date descending (most recent first)
    return combined.sort((a, b) => new Date(b.return_date).getTime() - new Date(a.return_date).getTime());
  }, []);

  const filteredHistory = useMemo(() => {
    if (!searchQuery) return allHistory;

    const query = searchQuery.toLowerCase();
    return allHistory.filter(r =>
      r.id.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.phone.includes(query)
    );
  }, [searchQuery, allHistory]);

  return (
    <div className="admin-shell py-8">
      <div className="mx-auto max-w-6xl">

        {/* Header Part */}
        <header className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Rental History</h1>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
              Complete archive of all completed and cancelled rental records.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search ID, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-2xl border border-line bg-white pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
            />
          </div>
        </header>

        {/* List Section */}
        <div className="space-y-6">
          {filteredHistory.length > 0 ? (
            <>
              <div className="flex items-center justify-between border-b border-line/60 pb-3 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">
                  Displaying {filteredHistory.length} Record{filteredHistory.length !== 1 && 's'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Latest First
                </span>
              </div>

              <RentalCard
                rentals={filteredHistory}
                activeTab="returning" // History defaults to returning/completed style
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-slate-50/50 py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white shadow-card border border-line/60 mb-6">
                <HistoryIcon className="h-10 w-10 text-muted/40" />
              </div>
              <h3 className="text-xl font-black text-ink">No Records Found</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-muted leading-relaxed">
                We couldn't find any rental history matching your search criteria.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <footer className="mt-12 flex items-center justify-center gap-2 border-t border-line/40 pt-8">
          <div className="h-1 w-1 rounded-full bg-line" />
          <p className="text-[10px] font-black uppercase tracking-widest text-tertiary/60">
            End of History Archive
          </p>
          <div className="h-1 w-1 rounded-full bg-line" />
        </footer>
      </div>
    </div>
  );
};

export default RentalHistory;
