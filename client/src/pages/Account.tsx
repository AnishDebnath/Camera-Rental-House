import { Download, LogOut, Pencil, QrCode, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import formatDate from '../utils/formatDate';

const Account = () => {
  const { user, rentals, refreshRentals, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(user);

  useEffect(() => {
    refreshRentals();
  }, []);

  useEffect(() => {
    setDraft(user);
  }, [user]);

  const activeRentals = rentals.filter((rental) =>
    rental.rental_items.some((item) => item.status !== 'returned'),
  );
  const pastRentals = rentals.filter((rental) =>
    rental.rental_items.every((item) => item.status === 'returned'),
  );

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    await updateProfile(draft);
    setLoading(false);
    setEditing(false);
  };

  return (
    <div className="page-animate app-shell space-y-6 pb-24">
      <section className="card-surface space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">{user.fullName}</h1>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing((current) => !current)}
            className="secondary-button w-fit"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Full name', 'fullName'],
            ['Phone', 'phone'],
            ['Email', 'email'],
            ['Facebook', 'facebook'],
            ['Instagram', 'instagram'],
            ['YouTube', 'youtube'],
          ].map(([label, key]) => (
            <label key={key} className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-tertiary">
                {label}
              </span>
              <div className="input-shell">
                <input
                  disabled={!editing}
                  value={draft?.[key] || ''}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0 disabled:text-muted"
                />
              </div>
            </label>
          ))}
        </div>

        {editing ? (
          <div className="flex flex-col gap-3 md:flex-row">
            <LoadingButton loading={loading} onClick={handleSave}>
              Save Changes
            </LoadingButton>
            <LoadingButton variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </LoadingButton>
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Active Rentals</h2>
          <p className="text-sm text-muted">
            Track release and return status for current orders.
          </p>
        </div>
        <div className="space-y-3">
          {activeRentals.map((rental) => (
            <article key={rental.id} className="card-surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{rental.id}</p>
                  <p className="text-xs text-muted">
                    {formatDate(rental.pickup_date)} to {formatDate(rental.event_date)}
                  </p>
                </div>
                <span className="rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
                  {rental.rental_items.some((item) => item.status === 'released')
                    ? 'Released'
                    : 'Pending Pickup'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Rental History</h2>
          <p className="text-sm text-muted">Past orders and returned inventory.</p>
        </div>
        <div className="space-y-3">
          {pastRentals.map((rental) => (
            <article key={rental.id} className="card-surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{rental.id}</p>
                  <p className="text-xs text-muted">
                    {formatDate(rental.pickup_date)} to {formatDate(rental.event_date)}
                  </p>
                </div>
                <span className="rounded-pill bg-success/10 px-4 py-2 text-xs font-semibold text-success">
                  Returned
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-surface space-y-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">User QR Code</h2>
            <p className="text-sm text-muted">
              Show this to the rental counter for identity verification.
            </p>
          </div>
        </div>
        <img
          src={user.userQrBase64}
          alt="User QR code"
          className="mx-auto h-52 w-52 rounded-[28px] border border-line bg-white p-4"
        />
        <button
          type="button"
          onClick={() => {
            window.open(user.userQrBase64, '_blank', 'noopener,noreferrer');
            addToast({
              title: 'QR opened',
              message: 'The demo QR opened in a new tab.',
              tone: 'success',
            });
          }}
          className="secondary-button w-full"
        >
          <Download className="mr-2 h-4 w-4" /> Download QR
        </button>
      </section>

      <button
        type="button"
        onClick={logout}
        className="pill-button w-full border border-danger/20 bg-danger/5 text-danger"
      >
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </button>
    </div>
  );
};

export default Account;
