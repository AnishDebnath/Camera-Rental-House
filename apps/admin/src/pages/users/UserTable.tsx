import { ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

type UserTableProps = {
  users: any[];
};

const UserTable = ({ users }: UserTableProps) => (
  <DataTable
    columns={[
      {
        key: 'full_name',
        label: 'Customer',
        render: (row) => (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-ink">
              {row.full_name
                .split(' ')
                .map((part: string) => part[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <p className="font-bold text-ink">{row.full_name}</p>
              <p className="text-xs font-medium text-tertiary">{row.phone}</p>
            </div>
          </div>
        ),
      },
      { key: 'email', label: 'Email' },
      { key: 'created_at', label: 'Joined' },
      { key: 'totalRentals', label: 'Rentals' },
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
            className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-bold ${
              row.is_blocked ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
            }`}
          >
            {row.is_blocked ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserRoundCheck className="h-3.5 w-3.5" />}
            {row.is_blocked ? 'Review' : 'Active'}
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'View',
        render: (row) => (
          <Link to={`/users/${row.id}`} className="secondary-button min-h-10 px-4 py-2">
            View
          </Link>
        ),
      },
    ]}
    rows={users}
    renderMobileCard={(row) => (
      <article key={row.id} className="card-surface p-4">
        <p className="text-sm font-bold text-ink">{row.full_name}</p>
        <p className="text-xs font-medium text-muted">{row.email}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-ink">{formatCurrency(row.totalSpent)}</span>
          <Link to={`/users/${row.id}`} className="secondary-button min-h-10 px-4 py-2">
            View
          </Link>
        </div>
      </article>
    )}
  />
);

export default UserTable;
