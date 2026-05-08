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

    return rawRentals.map((r: any) => {
      const rental = r.rentals ? r.rentals : r; // handle wrapped objects just in case
      const users = r.users || rental.users || {};
      
      return {
        id: rental.rental_no || rental.id.split('-')[0].toUpperCase(),
        name: users.full_name || 'Guest',
        user_image: users.avatar_url || '',
        phone: users.phone || 'N/A',
        pickup: rental.pickup_date,
        return_date: rental.event_date,
        total_price: rental.total_amount || 0,
        status: rental.status,
        products: (rental.products || []).map((p: any) => ({
          id: p.id,
          name: p.name || 'Unknown',
          price: p.price || 0,
          qty: p.qty || 1,
          image: p.image || '',
        })),
        handover_proof: rental.handover_proof_url,
      };
    });
  }, [rawRentals, activeTab]);


  const filteredRentals = useMemo(() => {
    let list = mappedRentals as any[];

    // Helper: extract local YYYY-MM-DD from ISO timestamp
    const toLocalDate = (iso: string) => {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Date filter: upcoming = pickup_date, returning = return_date, active = no date filter
    if (activeTab === 'upcoming') {
      list = list.filter(r => toLocalDate(r.pickup) === filterDate);
    } else if (activeTab === 'returning') {
      list = list.filter(r => toLocalDate(r.return_date) === filterDate && !['cancelled', 'failed', 'returned'].includes(r.status));
    }

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter((r) => 
        r.name.toLowerCase().includes(lowerQuery) || 
        r.id.toLowerCase().includes(lowerQuery)
      );
    }

    return list;
  }, [mappedRentals, activeTab, searchQuery, filterDate]);

  const [apiCounts, setApiCounts] = useState({ upcoming: 0, active: 0, returning: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get(`/manage/counts?date=${filterDate}`);
        setApiCounts({
          upcoming: response.data.upcoming,
          active: response.data.active,
          returning: response.data.returning
        });
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };
    fetchCounts();
  }, [rawRentals, filterDate]);

  const counts = useMemo(() => {
    return {
      upcoming: apiCounts.upcoming,
      active: apiCounts.active,
      returning: apiCounts.returning,
    };
  }, [apiCounts]);

  const shiftDate = (days: number) => {
    const [y, m, d] = filterDate.split('-').map(Number);
    const date = new Date(y, m - 1, d + days); // local date, no UTC issue
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
            <p className="text-sm font-bold text-muted">Fetching rental records...</p>
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
