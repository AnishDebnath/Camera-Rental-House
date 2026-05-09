import { ShieldCheck, UserRoundCheck, Eye, Ban, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

type UserCardProps = {
  users: any[];
};

const UserCard = ({ users }: UserCardProps) => (
  <DataTable
    columns={[
      {
        key: 'user',
        label: 'User',
        render: (row) => (
          <div className="flex items-center gap-3">
            {row.avatar_url ? (
              <img
                src={row.avatar_url}
                alt={row.full_name}
                className="h-10 w-10 shrink-0 rounded object-cover shadow-sm border border-line"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-light text-xs font-bold text-ink shadow-sm">
                {row.full_name
                  ?.split(' ')
                  .map((part: string) => part[0])
                  .slice(0, 2)
                  .join('')}
              </span>
            )}
            <p className="font-bold text-ink whitespace-nowrap">{row.full_name}</p>
          </div>
        ),
      },
      {
        key: 'member_id',
        label: 'User ID',
        render: (row) => <span className="font-mono text-xs font-bold text-primary bg-slate-50 px-2 py-1 rounded border border-line">{row.member_id || '-'}</span>,
      },
      {
        key: 'phone',
        label: 'Phone Number',
        render: (row) => <p className="text-sm font-medium text-ink">{row.phone}</p>,
      },
      {
        key: 'totalRentals',
        label: 'Total Rentals',
        render: (row) => <span className="font-bold text-ink">{row.totalRentals}</span>,
      },
      {
        key: 'totalSpent',
        label: 'Total Spent',
        render: (row) => <span className="font-bold text-ink">{formatCurrency(row.totalSpent)}</span>,
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <span
            className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              row.is_blocked ? 'bg-danger/10 text-danger' : 
              !row.is_verified ? 'bg-warning/10 text-warning' : 
              'bg-success/10 text-success'
            }`}
          >
            {row.is_blocked ? <Ban className="h-3.5 w-3.5" /> : !row.is_verified ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {row.is_blocked ? 'Blocked' : !row.is_verified ? 'Pending' : 'Verified'}
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'View Profile',
        render: (row) => (
          <Link
            to={`/users/${row.id}`}
            className="flex h-10 w-fit items-center justify-center rounded-card border border-line bg-white px-4 text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
          >
            <Eye className="mr-2 h-4 w-4 text-muted transition group-hover:text-white" />
            View
          </Link>
        ),
      },
    ]}
    rows={users}
    renderMobileCard={(row) => (
      <article key={row.id} className="card-surface p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {row.avatar_url ? (
            <img src={row.avatar_url} alt={row.full_name} className="h-12 w-12 shrink-0 rounded object-cover shadow-sm border border-line" />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary-light text-sm font-bold text-ink shadow-sm">
              {row.full_name?.split(' ').map((part: string) => part[0]).slice(0, 2).join('')}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-ink truncate">{row.full_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[10px] font-bold text-primary bg-slate-50 px-1.5 py-0.5 rounded border border-line">ID: {row.member_id || '-'}</span>
              <span className="text-[10px] font-medium text-tertiary truncate">{row.phone}</span>
            </div>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            row.is_blocked ? 'bg-danger/10 text-danger' : 
            !row.is_verified ? 'bg-warning/10 text-warning' : 
            'bg-success/10 text-success'
          }`}>
            {row.is_blocked ? <Ban className="h-3 w-3" /> : !row.is_verified ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
            {row.is_blocked ? 'Blocked' : !row.is_verified ? 'Pending' : 'Verified'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-xl border border-line/60">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">Total Rentals</p>
            <p className="text-sm font-bold text-ink mt-0.5">{row.totalRentals} Orders</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">Total Spent</p>
            <p className="text-sm font-bold text-ink mt-0.5">{formatCurrency(row.totalSpent)}</p>
          </div>
        </div>

        <Link
          to={`/users/${row.id}`}
          className="flex h-10 w-full items-center justify-center rounded-card border border-line bg-white px-4 text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
        >
          <Eye className="mr-2 h-4 w-4 text-muted transition group-hover:text-white" />
          View Full Profile
        </Link>
      </article>
    )}
  />
);

export default UserCard;
