import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminUsers } from '../data/mockAdmin';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useMemo(
    () => adminUsers.find((item) => item.id === id) || adminUsers[0],
    [id],
  );
  const [blocked, setBlocked] = useState(user.is_blocked);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return (
      <div className="admin-shell py-6">
        <div className="card-surface space-y-4 p-6">
          <h1 className="text-2xl font-bold text-ink">User removed in demo</h1>
          <p className="text-sm text-muted">
            This change is local to the preview and resets on refresh.
          </p>
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="primary-button"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-6 py-6">
      <section className="card-surface space-y-4 p-5">
        <h1 className="text-2xl font-bold text-ink">{user.full_name}</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-page p-4 text-sm text-muted">
            Phone
            <p className="mt-1 font-semibold text-ink">{user.phone}</p>
          </div>
          <div className="rounded-2xl bg-page p-4 text-sm text-muted">
            Email
            <p className="mt-1 font-semibold text-ink">{user.email}</p>
          </div>
          <div className="rounded-2xl bg-page p-4 text-sm text-muted">
            Joined
            <p className="mt-1 font-semibold text-ink">{user.created_at}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-surface p-5">
          <p className="mb-3 text-sm font-semibold text-ink">Aadhaar Copy</p>
          <img src={user.aadhaar_signed_url} alt="Aadhaar" className="w-full rounded-3xl object-cover" />
        </div>
        <div className="card-surface p-5">
          <p className="mb-3 text-sm font-semibold text-ink">Voter Card Copy</p>
          <img src={user.voter_signed_url} alt="Voter card" className="w-full rounded-3xl object-cover" />
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setBlocked((current) => !current)}
          className="pill-button border border-warning/20 bg-warning/10 text-warning"
        >
          {blocked ? 'Unblock User' : 'Block User'}
        </button>
        <button
          type="button"
          onClick={() => setDeleted(true)}
          className="pill-button border border-danger/20 bg-danger/5 text-danger"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
