import { Camera, X } from 'lucide-react';

interface Props {
  photo: string | null;
  onCapture: () => void;
  onClear: () => void;
}

const Step3Proof = ({ photo, onCapture, onClear }: Props) => {
  return (
    <section className="card-surface p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
          <Camera className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-ink">Step 3 — Handover Proof</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Capture live photo of user with products</p>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-slate-50/50 group">
        {photo ? (
          <div className="relative h-full w-full group">
            <img src={photo} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              onClick={onClear}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg transition-transform hover:scale-110 active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-center p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-card text-muted/30 border border-line/40">
              <Camera className="h-10 w-10" />
            </div>
            <p className="text-sm font-semibold text-ink">Ready for Capture</p>
            <p className="mt-2 text-xs font-medium text-muted leading-relaxed max-w-[180px]">
              Take a live picture for handover insurance and verification.
            </p>
            <button onClick={onCapture} className="mt-6 secondary-button w-full">
              Click Live Picture
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Step3Proof;
