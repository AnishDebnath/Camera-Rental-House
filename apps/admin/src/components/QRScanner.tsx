import { Camera, ScanLine } from 'lucide-react';

const QRScanner = ({ title, description, onMockScan }) => (
  <div className="card-surface space-y-4 p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <ScanLine className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-semibold text-ink">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
    <div className="rounded-[28px] border border-dashed border-line bg-page px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-card">
        <Camera className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-ink">Camera scanner overlay placeholder</p>
      <p className="mt-1 text-xs text-muted">
        Connect this component to `html5-qrcode` in production.
      </p>
    </div>
    <button type="button" onClick={onMockScan} className="secondary-button w-full">
      Simulate Scan
    </button>
  </div>
);

export default QRScanner;
