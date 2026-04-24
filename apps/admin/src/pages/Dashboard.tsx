import { ArrowRight, CalendarClock, PackagePlus, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { adminRentals, adminStats } from '../data/mockAdmin';
import { getAuthRole } from '../../../../packages/auth';

const Dashboard = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';

  return (
    <div className="admin-shell space-y-6 py-6">
      <section
        className={`rounded-[28px] border px-5 py-5 ${
          isStaff
            ? 'border-teal-200 bg-teal-50'
            : 'border-primary/10 bg-primary-light'
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
          {isStaff ? 'Staff Account' : 'Admin Account'}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-ink">
          {isStaff
            ? 'Counter workflow is active.'
            : 'Operations control is active.'}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {isStaff
            ? 'Access release, return, and daily rental handling.'
            : 'Full access to inventory, users, and business oversight.'}
        </p>
      </section>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted">
          Live operations snapshot for inventory, rentals, and customer activity.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((item) => (
          <StatsCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/products/add" className="card-surface flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-semibold text-ink">Add Product</p>
            <p className="text-sm text-muted">Create a new inventory item with QR label.</p>
          </div>
          <PackagePlus className="h-5 w-5 text-primary" />
        </Link>
        <Link to="/rentals" className="card-surface flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-semibold text-ink">Upcoming Rentals</p>
            <p className="text-sm text-muted">View tomorrow’s pickups and returns.</p>
          </div>
          <CalendarClock className="h-5 w-5 text-primary" />
        </Link>
        <Link to="/release" className="card-surface flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-semibold text-ink">Release Return Station</p>
            <p className="text-sm text-muted">Scan codes and verify users at the counter.</p>
          </div>
          <ScanLine className="h-5 w-5 text-primary" />
        </Link>
      </section>

      <section className="card-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Recent Activity</h2>
            <p className="text-sm text-muted">Last 10 rental confirmations.</p>
          </div>
          <Link to="/rentals" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {adminRentals.upcoming.map((rental) => (
            <div
              key={rental.id}
              className="flex items-center justify-between rounded-2xl bg-page px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{rental.name}</p>
                <p className="text-xs text-muted">{rental.items}</p>
              </div>
              <span className="rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
                {rental.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
