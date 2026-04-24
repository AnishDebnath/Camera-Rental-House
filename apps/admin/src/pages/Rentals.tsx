import { useState } from 'react';
import { adminRentals } from '../data/mockAdmin';
import { getAuthRole } from '../../../../packages/auth';

const tabs = ['upcoming', 'active', 'past'];

const Rentals = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [activeTab, setActiveTab] = useState('upcoming');

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
          {isStaff ? 'Staff Rentals View' : 'Admin Rentals View'}
        </p>
        <p className="mt-2 text-sm text-muted">
          {isStaff
            ? 'Access active counter operations and handoff schedules.'
            : 'Monitor oversight across upcoming, active, and completed orders.'}
        </p>
      </section>

      <div>
        <h1 className="text-2xl font-bold text-ink">Rentals</h1>
        <p className="text-sm text-muted">Track upcoming, active, and returned orders.</p>
      </div>

      <div className="flex gap-4 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-1 pb-3 text-sm font-semibold capitalize ${
              activeTab === tab
                ? isStaff
                  ? 'border-teal-500 text-teal-700'
                  : 'border-primary text-primary'
                : 'border-transparent text-muted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {adminRentals[activeTab].map((rental) => (
          <article key={rental.id} className="card-surface p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{rental.name}</p>
                <p className="text-xs text-muted">{rental.phone}</p>
                <p className="mt-2 text-sm text-muted">{rental.items}</p>
              </div>
              <div className="space-y-2 text-sm text-muted">
                <p>Pickup: {rental.pickup}</p>
                <p>Event: {rental.event}</p>
                <span className="inline-flex rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
                  {rental.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Rentals;
