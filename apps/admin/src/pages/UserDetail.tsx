import { Ban, Trash2, UserRoundCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminUsers } from '../data/mockAdmin';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useMemo(() => adminUsers.find((item) => item.id === id) || adminUsers[0], [id]);
  const [blocked, setBlocked] = useState(user.is_blocked);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return (
      <div className="admin-shell py-6">
        <div className="card-surface space-y-4 p-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink">User Removed</h1>
          <p className="text-sm font-medium text-muted">This user account has been removed from the system.</p>
          <button type="button" onClick={() => navigate('/users')} className="primary-button">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      <section className="card-surface space-y-5 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">{user.full_name}</h1>
            <p className="mt-2 text-sm font-medium text-muted">Customer profile, documents, and account controls.</p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-pill px-4 py-2 text-xs font-bold ${
              blocked ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
            }`}
          >
            {blocked ? <Ban className="h-4 w-4" /> : <UserRoundCheck className="h-4 w-4" />}
            {blocked ? 'Review Required' : 'Active'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: 'Phone', value: user.phone, tone: 'bg-sky-50' },
            { label: 'Email', value: user.email, tone: 'bg-emerald-50' },
            { label: 'Joined', value: user.created_at, tone: 'bg-amber-50' },
          ].map((item) => (
            <div key={item.label} className={`rounded-card p-4 text-sm font-medium text-muted ${item.tone}`}>
              {item.label}
              <p className="mt-1 break-words font-bold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-surface p-5 md:p-6">
          <p className="mb-3 text-sm font-bold text-ink">Aadhaar Copy</p>
          <img src={user.aadhaar_signed_url} alt="Aadhaar" className="w-full rounded-card border border-line object-cover shadow-sm" />
        </div>
        <div className="card-surface p-5 md:p-6">
          <p className="mb-3 text-sm font-bold text-ink">Voter Card Copy</p>
          <img src={user.voter_signed_url} alt="Voter card" className="w-full rounded-card border border-line object-cover shadow-sm" />
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setBlocked((current) => !current)}
          className="pill-button border border-warning/20 bg-warning/10 text-warning hover:bg-warning hover:text-white"
        >
          {blocked ? 'Unblock User' : 'Block User'}
        </button>
        <button
          type="button"
          onClick={() => setDeleted(true)}
          className="pill-button border border-danger/20 bg-danger/5 text-danger hover:bg-danger hover:text-white"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
