import { Building2, PlusCircle, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';

type HouseListProps = {
  houses: any[];
};

const HouseList = ({ houses }: HouseListProps) => {
  const columns = [
    {
      key: 'house',
      label: 'Production House',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-light text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink">{row.name}</p>
            <p className="text-[10px] font-bold uppercase text-muted/60">{row.contact}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (row: any) => (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-ink">{row.phone}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'users',
      label: 'Members',
      render: (row: any) => (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          <User className="h-3.5 w-3.5" /> {row.usersCount}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span
          className={`inline-flex rounded-pill px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            row.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin-booking?houseId=${row.id}`}
            className="flex h-9 items-center justify-center rounded-card border border-line bg-white px-4 text-xs font-bold text-ink hover:bg-slate-900 hover:text-white transition-colors"
          >
            <PlusCircle className="mr-2 h-3.5 w-3.5" />
            Book
          </Link>
          <button className="flex h-9 w-9 items-center justify-center rounded-card border border-line bg-white text-muted hover:bg-slate-50">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="card-surface overflow-hidden">
      <DataTable 
        columns={columns} 
        rows={houses} 
        renderMobileCard={(row) => (
          <div key={row.id} className="card-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-light text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-ink">{row.name}</p>
                  <p className="text-[10px] font-bold uppercase text-muted/60">{row.contact}</p>
                </div>
              </div>
              <span className={`rounded-pill px-2 py-1 text-[10px] font-bold uppercase ${row.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                {row.status}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line/50 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted mb-1">Contact</span>
                <span className="text-sm font-bold text-ink">{row.phone}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-muted mb-1">Members</span>
                <span className="text-sm font-black text-ink">{row.usersCount}</span>
              </div>
            </div>
            <Link
              to={`/admin-booking?houseId=${row.id}`}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-[13px] font-black text-white"
            >
              <PlusCircle className="h-4 w-4" />
              New Partner Booking
            </Link>
          </div>
        )}
      />
    </div>
  );
};

export default HouseList;
