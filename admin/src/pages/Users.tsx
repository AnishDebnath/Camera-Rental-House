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
  return (
    <div className="admin-shell space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Users</h1>
        <p className="text-sm text-muted">Search and manage customer verification records.</p>
      </div>

      <DataTable
        columns={[
          { key: 'full_name', label: 'Full Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'created_at', label: 'Joined' },
          { key: 'totalRentals', label: 'Rentals' },
          {
            key: 'totalSpent',
            label: 'Total Spent',
            render: (row) => formatCurrency(row.totalSpent),
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span
                className={`rounded-pill px-4 py-2 text-xs font-semibold ${
                  row.is_blocked
                    ? 'bg-warning/10 text-warning'
                    : 'bg-success/10 text-success'
                }`}
              >
                {row.is_blocked ? 'Blocked' : 'Active'}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'View',
            render: (row) => (
              <Link to={`/users/${row.id}`} className="secondary-button">
                View
              </Link>
            ),
          },
        ]}
        rows={adminUsers}
        renderMobileCard={(row) => (
          <article key={row.id} className="card-surface p-4">
            <p className="text-sm font-semibold text-ink">{row.full_name}</p>
            <p className="text-xs text-muted">{row.email}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(row.totalSpent)}
              </span>
              <Link to={`/users/${row.id}`} className="secondary-button">
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
