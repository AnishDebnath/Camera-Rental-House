import { useState, useMemo, useEffect } from 'react';
import { Search, History as HistoryIcon, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import RentalCard from './RentalCard';

const RentalHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rawRentals, setRawRentals] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/admin/rentals/past');
        const data = response.data.items || response.data;
        setRawRentals(data);
      } catch (error) {
        console.error('Failed to fetch rental history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const allHistory = useMemo(() => {
    return rawRentals.map((rental: any) => ({
      actualId: rental.id,
      id: rental.rental_no || rental.id.split('-')[0].toUpperCase(),
      name: rental.users?.full_name || 'Guest',
      user_image: rental.users?.avatar_url || '',
      phone: rental.users?.phone || 'N/A',
      pickup: rental.pickup_date,
      return_date: rental.event_date,
      total_price: rental.total_amount || 0,
      status: rental.status,
      products: (rental.rental_items || []).map((item: any) => ({
        id: item.product_id,
        name: item.products?.name || 'Unknown',
        price: item.products?.price_per_day || 0,
        qty: item.quantity,
        image: item.products?.images?.[0] || '',
      })),
      received_at: rental.received_at,
      created_at: rental.created_at
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [rawRentals]);

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
          {loading ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
              <p className="text-sm font-bold text-muted">Fetching archived records...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
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
          ) : allHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-slate-50/50 py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white shadow-card border border-line/60 mb-6">
                <HistoryIcon className="h-10 w-10 text-muted/20" />
              </div>
              <h3 className="text-xl font-black text-ink">Archive Empty</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-muted leading-relaxed">
                There are no completed or cancelled rental records in the system yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-slate-50/50 py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white shadow-card border border-line/60 mb-6">
                <Search className="h-10 w-10 text-muted/40" />
              </div>
              <h3 className="text-xl font-black text-ink">No Match Found</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-muted leading-relaxed">
                We couldn't find any records matching "{searchQuery}". Try a different ID or name.
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
