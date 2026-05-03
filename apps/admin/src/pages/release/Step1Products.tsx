import { motion } from 'framer-motion';
import { PackageCheck, QrCode, CheckCircle2 } from 'lucide-react';

interface Props {
  products: any[];
  scannedProducts: string[];
  onVerifyClick: (product: any) => void;
}

const Step1Products = ({ products, scannedProducts, onVerifyClick }: Props) => {
  return (
    <section className="card-surface p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-sm border border-sky-100">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-ink">Step 1 — Products</h3>
              <p className="text-xs font-medium text-muted mt-0.5">Scan codes to confirm gear availability</p>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100 shadow-sm">
              {scannedProducts.length} / {products.length}
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-tertiary">Verified</span>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/30">
          <motion.div
            className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
            initial={{ width: 0 }}
            animate={{ width: `${(scannedProducts.length / products.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {products.map((p) => {
          const isScanned = scannedProducts.includes(p.id);
          return (
            <div
              key={p.id}
              className={`group relative flex flex-col gap-4 rounded-xl border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:p-3 ${isScanned ? 'border-emerald-200 bg-emerald-50/20' : 'border-line bg-white hover:border-line-hover'}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-slate-50 sm:h-12 sm:w-12">
                  <img
                    src={p.image}
                    className="h-full w-full object-cover transition-all"
                  />
                  {isScanned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
                      <div className="rounded-full bg-emerald-500 p-1 text-white shadow-lg">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-sm font-bold text-ink leading-tight">{p.name}</p>
                  <p className="text-[12px] font-extrabold text-tertiary uppercase tracking-widest">
                    Product Code: {p.id.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onVerifyClick(p)}
                disabled={isScanned}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-all sm:h-9 sm:px-3 ${isScanned
                  ? 'bg-emerald-500 text-white cursor-default pointer-events-none shadow-sm'
                  : 'bg-slate-50 text-ink border border-line hover:bg-slate-100 active:scale-95'
                  }`}
              >
                <QrCode className="h-4 w-4" />
                {isScanned ? 'Verified' : 'Verify QR Code'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Step1Products;
