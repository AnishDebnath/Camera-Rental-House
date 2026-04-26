import { CheckCircle2, ScanLine } from 'lucide-react';
import { useState } from 'react';
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
    <div className="admin-shell space-y-5 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Release or Return Gear</h1>
        <p className="mt-2 text-sm font-medium text-muted">
          {isStaff
            ? 'Counter station for scanning products, verifying users, and closing handoffs.'
            : 'Admin station for manual release, return, and verification workflows.'}
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="card-surface space-y-5 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-card bg-sky-50 text-ink">
                <ScanLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Manual Product Lookup</h2>
                <p className="mt-1 text-sm font-medium text-muted">
                  Enter a product code when a QR scan is unavailable.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="input-shell flex-1">
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Enter product code e.g. CAM-4X9K"
                  className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
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
                className="primary-button md:min-w-36"
              >
                Submit
              </button>
            </div>
          </section>

          <QRScanner
            title="Scan Product QR"
            description="Use the browser camera overlay for quick product lookup."
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

          <QRScanner
            title="Verify User Identity"
            description="Scan the customer QR and confirm documents before handoff."
            onMockScan={() =>
              setVerifiedUser({
                name: 'John Doe',
                badge: 'Verified',
              })
            }
          />
        </div>

        <aside className="space-y-5">
          <section className="card-surface p-5">
            <h2 className="text-lg font-bold text-ink">Handoff Status</h2>
            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-card bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <p className="text-sm font-bold text-ink">{result.product}</p>
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted">
                    {result.user} - {result.phone}
                  </p>
                </div>
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
                  <p className="rounded-card bg-success/10 px-4 py-3 text-sm font-bold text-success">
                    {actionMessage}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm font-medium text-muted">Scan or submit a product code to start.</p>
            )}
          </section>

          <section className="card-surface p-5">
            <h2 className="text-lg font-bold text-ink">User Verification</h2>
            {verifiedUser ? (
              <div className="mt-5 rounded-card bg-sky-50 p-4">
                <p className="text-base font-bold text-ink">{verifiedUser.name}</p>
                <span className="mt-3 inline-flex rounded-pill bg-success/10 px-4 py-2 text-xs font-bold text-success">
                  {verifiedUser.badge}
                </span>
              </div>
            ) : (
              <p className="mt-4 text-sm font-medium text-muted">No customer QR has been scanned yet.</p>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
};

export default ReleaseReturn;
