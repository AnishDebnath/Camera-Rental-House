import { CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  allProductsScanned: boolean;
  isUserVerified: boolean;
  hasProofPhoto: boolean;
  onRelease: () => void;
  onReset: () => void;
}

const ReleaseSummary = ({
  allProductsScanned,
  isUserVerified,
  hasProofPhoto,
  onRelease,
  onReset,
}: Props) => {
  const checklist = [
    { label: 'Products Verified', status: allProductsScanned },
    { label: 'Identity Matched', status: isUserVerified },
    { label: 'Photo Evidence', status: hasProofPhoto },
  ];

  return (
    <div className="space-y-4">
      <div className="card-surface p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-5">Process Status</h4>
        <div className="space-y-4">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">{item.label}</span>
              <div
                className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                  item.status ? 'text-emerald-500' : 'text-slate-300'
                }`}
              >
                {item.status ? (
                  <>
                    DONE <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    PENDING <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        disabled={!allProductsScanned || !isUserVerified || !hasProofPhoto}
        onClick={onRelease}
        className="primary-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Release Equipment
      </button>

      <button
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Reset Session
      </button>
    </div>
  );
};

export default ReleaseSummary;
