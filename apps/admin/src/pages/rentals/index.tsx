import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { getAuthRole } from '../../../../../packages/auth';

// Modular Components
import RentalHeader from './RentalHeader';
import RentalTabs from './RentalTabs';
import RentalCard from './RentalCard';
import CustomDatePicker from './CustomDatePicker';

const Rentals = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'returning'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rawRentals, setRawRentals] = useState<any[]>([]);
  
  // Default to today's date (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);
  const [filterDate, setFilterDate] = useState(todayStr);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        let endpoint = '/admin/rentals/upcoming';
        if (activeTab === 'active') endpoint = '/admin/rentals/active';
        if (activeTab === 'returning') endpoint = '/admin/rentals/past';

        const response = await axiosInstance.get(endpoint);
        const data = response.data.items || response.data; // Handle pagination wrapper if present
        setRawRentals(data);
      } catch (error) {
        console.error('Failed to fetch rentals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [activeTab]);

  const mappedRentals = useMemo(() => {
    if (!rawRentals.length) return [];

    if (activeTab === 'upcoming') {
      return rawRentals.map((r: any) => ({
        id: r.rental_no || r.id.split('-')[0].toUpperCase(),
        name: r.users?.full_name || 'Guest',
        phone: r.users?.phone || 'N/A',
        pickup: r.pickup_date,
        return_date: r.event_date,
        total_price: r.total_amount || (r.rental_items || []).reduce((sum: number, item: any) => sum + (item.products?.price_per_day || 0) * item.quantity * ((Math.round((new Date(r.event_date).getTime() - new Date(r.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1), 0),
        status: r.status,
        products: (r.rental_items || []).map((item: any) => ({
          id: item.product_id,
          name: item.products?.name || 'Unknown',
          price: item.products?.price_per_day || 0,
          qty: item.quantity,
          image: item.products?.images?.[0] || '',
        })),
      }));
    }

    // For active/past, group by rental_id
    const grouped = rawRentals.reduce((acc: any, item: any) => {
      const rental = item.rentals;
      if (!rental) return acc;
      
      if (!acc[rental.id]) {
        acc[rental.id] = {
          id: rental.rental_no || rental.id.split('-')[0].toUpperCase(),
          name: rental.users?.full_name || 'Guest',
          phone: rental.users?.phone || 'N/A',
          pickup: rental.pickup_date,
          return_date: rental.event_date,
          total_price: rental.total_amount || (rental.rental_items || []).reduce((sum: number, ri: any) => sum + (ri.products?.price_per_day || 0) * ri.quantity * ((Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1), 0),
          status: item.status === 'released' ? 'active' : 'completed',
          products: [],
        };
      }
      
      acc[rental.id].products.push({
        id: item.product_id,
        name: item.products?.name || 'Unknown',
        price: item.products?.price_per_day || 0,
        qty: item.quantity,
        image: item.products?.images?.[0] || '',
      });
      
      return acc;
    }, {});

    return Object.values(grouped);
  }, [rawRentals, activeTab]);

  const counts = {
    upcoming: activeTab === 'upcoming' ? mappedRentals.length : 0,
    active: activeTab === 'active' ? mappedRentals.length : 0,
    returning: activeTab === 'returning' ? mappedRentals.length : 0,
  };

  const filteredRentals = useMemo(() => {
    let list = mappedRentals as any[];

    // 1. Filter by Date (Only for Return tab strictly, Upcoming shows all queue by default but can be filtered)
    if (activeTab === 'returning') {
      list = list.filter(r => r.return_date.startsWith(filterDate));
    } else if (activeTab === 'upcoming') {
      // Optional: highlight today, but show all upcoming in the list
      // For now, let's keep the date navigator but make it filter ONLY if user intentionally navigated away from today or if we want strict daily view.
      // USER REQUEST: "can't show". Likely because they booked for a future date.
      // FIX: If in upcoming tab, we only filter by date if the user has changed the date from today, OR we just show all.
      // Let's show all for now to be safe.
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter((r) => 
        r.name.toLowerCase().includes(lowerQuery) || 
        r.id.toLowerCase().includes(lowerQuery)
      );
    }

    return list;
  }, [mappedRentals, activeTab, searchQuery, filterDate]);

  const shiftDate = (days: number) => {
    const date = new Date(filterDate);
    date.setDate(date.getDate() + days);
    setFilterDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  };

  const displayDate = useMemo(() => {
    const [y, m, d] = filterDate.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const formatted = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    if (filterDate === todayStr) return `Today, ${formatted}`;
    return formatted;
  }, [filterDate, todayStr]);

  return (
    <div className="admin-shell space-y-6 py-8">
      <RentalHeader isStaff={isStaff} />

      <div className="space-y-6">
        <RentalTabs 
          activeTab={activeTab} 
          setActiveTab={(tab: any) => {
            setActiveTab(tab);
            setSearchQuery('');
          }} 
          counts={counts} 
        />

        {/* Toolbar: Search + Date Filter */}
        <section className="card-surface p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <label className="input-shell min-h-11 flex-1">
              <Search className="h-4 w-4 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name or rental code..."
                className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
              />
            </label>

            {/* Date Navigator */}
            {activeTab !== 'active' && (
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="flex flex-1 items-center justify-between gap-1 rounded-xl border border-line bg-slate-50/50 p-1 sm:justify-start">
                  <button 
                    onClick={() => shiftDate(-1)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink hover:shadow-sm transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <span className="flex-1 text-center text-sm font-bold text-ink select-none px-2 sm:min-w-[110px]">
                    {displayDate}
                  </span>

                  <button 
                    onClick={() => shiftDate(1)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink hover:shadow-sm transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <CustomDatePicker 
                  selectedDate={filterDate}
                  onChange={setFilterDate}
                />
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
            <p className="text-sm font-bold text-muted">Synchronizing with vault...</p>
          </div>
        ) : (
          <RentalCard 
            rentals={filteredRentals} 
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default Rentals;
