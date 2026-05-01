import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { adminRentals } from '../../data/mockAdmin';
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
  
  // Default to today's date (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const today = new Date();
    // Use local date instead of UTC to avoid timezone shift
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);
  const [filterDate, setFilterDate] = useState(todayStr);

  const counts = {
    upcoming: adminRentals.upcoming.length,
    active: adminRentals.active.length,
    returning: adminRentals.returning.length,
  };

  const filteredRentals = useMemo(() => {
    let list = adminRentals[activeTab];

    // 1. Filter by Date (Only for Collect and Return tabs)
    if (activeTab === 'upcoming') {
      list = list.filter(r => r.pickup === filterDate);
    } else if (activeTab === 'returning') {
      list = list.filter(r => r.return_date === filterDate);
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
  }, [activeTab, searchQuery, filterDate]);

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
            setSearchQuery(''); // Reset search on tab change
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

            {/* Date Navigator (Hidden in Active tab) */}
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

        <RentalCard 
          rentals={filteredRentals} 
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default Rentals;
