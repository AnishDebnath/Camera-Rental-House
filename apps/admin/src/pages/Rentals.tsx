import { CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { useState } from 'react';
import { adminRentals } from '../data/mockAdmin';
import { getAuthRole } from '../../../../packages/auth';

const tabs = ['upcoming', 'active', 'past'];

const tabIcons = {
  upcoming: CalendarDays,
  active: Clock3,
  past: CheckCircle2,
};

const Rentals = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="admin-shell space-y-5 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Rentals</h1>
        <p className="mt-2 text-sm font-medium text-muted">
          {isStaff
            ? 'Counter view for handoffs, returns, and customer pickup timing.'
            : 'Track upcoming, active, and completed camera rental orders.'}
        </p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab];
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-card border p-4 text-left shadow-card transition ${
                activeTab === tab
                  ? 'border-primary bg-primary text-white'
                  : 'border-white/70 bg-white/[0.82] text-ink hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold capitalize">{tab}</p>
                <Icon className="h-5 w-5" />
              </div>
              <p className={`mt-3 text-3xl font-bold ${activeTab === tab ? 'text-white' : 'text-ink'}`}>
                {adminRentals[tab].length}
              </p>
            </button>
          );
        })}
      </section>

      <div className="space-y-3">
        {adminRentals[activeTab].map((rental) => (
          <article key={rental.id} className="card-surface p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base font-bold text-ink">{rental.name}</p>
                  <span className="rounded-pill bg-primary-light px-3 py-1 text-xs font-bold text-ink">
                    {rental.id}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-muted">{rental.phone}</p>
                <p className="mt-3 text-sm font-semibold text-ink">{rental.items}</p>
              </div>
              <div className="grid gap-3 text-sm font-medium text-muted sm:grid-cols-3 md:min-w-[360px]">
                <div className="rounded-card bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-tertiary">Pickup</p>
                  <p className="mt-1 font-bold text-ink">{rental.pickup}</p>
                </div>
                <div className="rounded-card bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-tertiary">Event</p>
                  <p className="mt-1 font-bold text-ink">{rental.event}</p>
                </div>
                <div className="rounded-card bg-emerald-50 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-tertiary">Status</p>
                  <p className="mt-1 font-bold capitalize text-success">{rental.status}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Rentals;
