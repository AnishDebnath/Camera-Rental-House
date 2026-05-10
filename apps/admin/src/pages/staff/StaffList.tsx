import { Phone, Calendar } from 'lucide-react';
import DataTable from '../../components/DataTable';

interface StaffListProps {
  staff: any[];
}

const StaffList = ({ staff = [] }: StaffListProps) => {
  const columns = [
    {
      key: 'full_name',
      label: 'Member',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0">
            {row.avatar_url ? (
              <img src={row.avatar_url} className="h-full w-full rounded-full object-cover border border-line" alt={row.full_name || 'Staff'} />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 border border-line">
                {(row.full_name || row.username || 'A').charAt(0)}
              </div>
            )}
            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${row.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight">{row.full_name || 'Unnamed Staff'}</p>
            <p className="text-xs text-muted">@{row.username || 'unknown'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row: any) => (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${row.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
          {row.role || 'staff'}
        </span>
      )
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (row: any) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
            <Phone className="h-3 w-3 text-muted" />
            {row.phone || 'No phone'}
          </div>
          {row.last_login_at && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted">
              <Calendar className="h-3 w-3" />
              Active {new Date(row.last_login_at).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
  ];

  const renderMobileCard = (row: any) => (
    <div key={row.id} className="relative rounded-2xl border border-line bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          {row.avatar_url ? (
            <img src={row.avatar_url} className="h-full w-full rounded-2xl object-cover border border-line" alt={row.full_name || 'Staff'} />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-600 text-lg border border-line">
              {(row.full_name || row.username || 'A').charAt(0)}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${row.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink truncate">{row.full_name || 'Unnamed Staff'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">@{row.username || 'unknown'}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{row.role || 'staff'}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
          <Phone className="h-3.5 w-3.5" />
          {row.phone || 'No phone'}
        </div>
        <div className="text-[10px] font-bold text-muted uppercase tracking-tighter">
          Joined {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Unknown'}
        </div>
      </div>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={staff}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default StaffList;
