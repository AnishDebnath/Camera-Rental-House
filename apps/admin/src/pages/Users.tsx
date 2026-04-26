import { Search, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { adminUsers } from '../data/mockAdmin';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Users = () => {
  const activeUsers = adminUsers.filter((user) => !user.is_blocked).length;

  return (
    <div className="admin-shell space-y-5 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Customers</h1>
        <p className="mt-2 text-sm font-medium text-muted">Search and manage customer verification records.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-card border border-white/70 bg-sky-50 p-4 shadow-card">
          <p className="text-sm font-bold text-ink">Total Customers</p>
          <p className="mt-3 text-3xl font-bold text-ink">{adminUsers.length}</p>
        </article>
        <article className="rounded-card border border-white/70 bg-emerald-50 p-4 shadow-card">
          <p className="text-sm font-bold text-ink">Verified</p>
          <p className="mt-3 text-3xl font-bold text-ink">{activeUsers}</p>
        </article>
        <article className="rounded-card border border-white/70 bg-amber-50 p-4 shadow-card">
          <p className="text-sm font-bold text-ink">Needs Review</p>
          <p className="mt-3 text-3xl font-bold text-ink">{adminUsers.length - activeUsers}</p>
        </article>
      </section>

      <section className="card-surface p-4">
        <label className="input-shell min-h-11 md:max-w-lg">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="search"
            placeholder="Search customer name, phone, or email..."
            className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
          />
        </label>
      </section>

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
                    .map((part) => part[0])
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
        rows={adminUsers}
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
    </div>
  );
};

export default Users;
