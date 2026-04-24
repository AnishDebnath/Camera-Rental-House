import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import { getAuthRole } from '../../../../packages/auth';

const ReleaseReturn = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [actionMessage, setActionMessage] = useState('');

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
          {isStaff ? 'Staff Counter Station' : 'Admin Oversight Station'}
        </p>
        <p className="mt-2 text-sm text-muted">
          {isStaff
            ? 'Use this station for day-of gear release and return workflows.'
            : 'Admins can use this station to monitor or manually process handoffs.'}
        </p>
      </section>

      <section className="card-surface space-y-5 p-5">
        <div>
          <h1 className="text-2xl font-bold text-ink">Release or Return Gear</h1>
          <p className="text-sm text-muted">
            Enter a product code or scan a QR to release and return equipment.
          </p>
        </div>
        <div className="input-shell">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter product code e.g. CAM-4X9K"
            className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setActionMessage('');
            setResult({
              product: 'Sony FX3 Cinema Camera',
              status: code === 'CAM-4X9K' ? 'released' : 'pending_pickup',
              user: 'John Doe',
              phone: '9876543210',
            });
          }}
          className="primary-button w-full"
        >
          Submit
        </button>
      </section>

      <QRScanner
        title="Scan QR Code"
        description="Use the browser camera overlay for quick product lookups."
        onMockScan={() => {
          setActionMessage('');
          setResult({
            product: 'Sony FX3 Cinema Camera',
            status: 'pending_pickup',
            user: 'John Doe',
            phone: '9876543210',
          });
        }}
      />

      {result ? (
        <section className="card-surface space-y-4 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <p className="text-base font-semibold text-ink">{result.product}</p>
          </div>
          <p className="text-sm text-muted">
            {result.user} - {result.phone}
          </p>
          <button
            type="button"
            onClick={() =>
              setActionMessage(
                result.status === 'released'
                  ? 'Return completed successfully.'
                  : 'Release completed successfully.',
              )
            }
            className="primary-button w-full"
          >
            {result.status === 'released' ? 'Confirm Return' : 'Confirm Release'}
          </button>
          {actionMessage ? (
            <p className="rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
              {actionMessage}
            </p>
          ) : null}
        </section>
      ) : null}

      <QRScanner
        title="Verify User Identity"
        description="Scan the user QR and verify documents before handoff."
        onMockScan={() =>
          setVerifiedUser({
            name: 'John Doe',
            badge: 'Verified',
          })
        }
      />

      {verifiedUser ? (
        <section className="card-surface p-5">
          <p className="text-base font-semibold text-ink">{verifiedUser.name}</p>
          <span className="mt-3 inline-flex rounded-pill bg-success/10 px-4 py-2 text-xs font-semibold text-success">
            {verifiedUser.badge}
          </span>
        </section>
      ) : null}
    </div>
  );
};

export default ReleaseReturn;
