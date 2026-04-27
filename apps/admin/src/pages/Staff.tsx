import { UserCog, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import DataTable from '../components/DataTable';

const mockStaff = [
  { id: '1', name: 'Alex Rivera', role: 'Inventory Manager', email: 'alex@camera-house.com', status: 'Online' },
  { id: '2', name: 'Elena Gilbert', role: 'Counter Staff', email: 'elena@camera-house.com', status: 'On Break' },
  { id: '3', name: 'Damon Salvatore', role: 'Counter Staff', email: 'damon@camera-house.com', status: 'Offline' },
];

const Staff = () => {
  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-ink">{row.name}</p>
            <p className="text-xs text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold ${
            row.status === 'Online'
              ? 'text-emerald-600'
              : row.status === 'On Break'
              ? 'text-amber-600'
              : 'text-slate-400'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              row.status === 'Online' ? 'bg-emerald-500' : row.status === 'On Break' ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          />
          {row.status}
        </span>
      ),
    },
  ];

  const renderMobileCard = (row: any) => (
    <div key={row.id} className="card-surface p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm">
          {row.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink truncate">{row.name}</p>
          <p className="text-xs text-muted truncate">{row.role}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-black uppercase ${
            row.status === 'Online' ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          {row.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="admin-shell py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink">Team Members</h1>
          <p className="text-sm font-medium text-muted">Manage internal staff and their platform access.</p>
        </div>
        <button className="primary-button">
          <UserCog className="mr-2 h-4 w-4" />
          Add Staff
        </button>
      </div>
      <DataTable columns={columns} rows={mockStaff} renderMobileCard={renderMobileCard} />
    </div>
  );
};

export default Staff;
