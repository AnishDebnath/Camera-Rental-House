import { useState } from 'react';
import { Building2, Search, UserPlus, PackageSearch, ChevronRight, User, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';

// Mock data for Production Houses
const mockHouses = [
  { 
    id: '1', 
    name: 'Dreamscape Studios', 
    contact: 'John Smith', 
    phone: '+1 234 567 890', 
    usersCount: 12, 
    activeOrders: 3,
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'Pixel Perfect Productions', 
    contact: 'Sarah Wilson', 
    phone: '+1 987 654 321', 
    usersCount: 8, 
    activeOrders: 1,
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Urban Frame Media', 
    contact: 'Mike Johnson', 
    phone: '+1 555 123 456', 
    usersCount: 5, 
    activeOrders: 0,
    status: 'Pending'
  },
];

const ProductionHouses = () => {
  const [selectedHouse, setSelectedHouse] = useState<any>(null);

  const columns = [
    {
      key: 'name',
      label: 'Production House',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink">{row.name}</p>
            <p className="text-xs text-muted">{row.contact}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Contact' },
    {
      key: 'usersCount',
      label: 'Users',
      render: (row: any) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          <User className="h-3 w-3" /> {row.usersCount} members
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
            row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin-booking?houseId=${row.id}`}
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Book
          </Link>
          <button
            onClick={() => setSelectedHouse(row)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (row: any) => (
    <div key={row.id} className="card-surface p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="font-bold text-ink">{row.name}</p>
        </div>
        <button
          onClick={() => setSelectedHouse(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between border-t border-line/50 pt-3">
        <span className="text-xs font-bold text-muted">{row.usersCount} members</span>
        <span
          className={`text-[10px] font-black uppercase ${
            row.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'
          }`}
        >
          {row.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="admin-shell py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink">Production Houses</h1>
          <p className="text-sm font-medium text-muted">Manage business partners and their equipment users.</p>
        </div>
        <button className="primary-button group">
          <Building2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Register New House
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-5 w-5 text-muted" />
            <input 
              type="text" 
              placeholder="Search production houses..." 
              className="flex-1 border-none bg-transparent py-2 text-sm font-medium placeholder:text-muted focus:ring-0"
            />
          </div>

          <DataTable columns={columns} rows={mockHouses} renderMobileCard={renderMobileCard} />
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-black text-ink">Partner Booking</h2>
            <p className="mb-6 text-sm font-medium text-muted leading-relaxed">
              Create a new rental order on behalf of a partner. Select gears and assign a receiver.
            </p>
            
            <Link 
              to="/admin-booking"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black text-white hover:bg-black transition-all shadow-lg shadow-black/10"
            >
              <PackageSearch className="h-5 w-5" />
              New On-Behalf Booking
            </Link>
          </div>

          <div className="rounded-3xl border border-dashed border-line bg-slate-50/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-line">
                <UserPlus className="h-5 w-5 text-muted" />
              </div>
              <h3 className="font-bold text-ink">New Member?</h3>
            </div>
            <p className="text-sm text-muted font-medium mb-4">
              Add a new user to an existing production house to track their rentals.
            </p>
            <button className="text-sm font-bold text-primary hover:underline">
              Register member details &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionHouses;
