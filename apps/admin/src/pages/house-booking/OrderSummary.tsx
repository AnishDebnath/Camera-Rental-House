import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, Trash2, ChevronRight, Info } from 'lucide-react';

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

interface OrderSummaryProps {
  cart: any[];
  removeFromCart: (id: string) => void;
  handleProcessBooking: () => void;
}

export const OrderSummary = ({ cart, removeFromCart, handleProcessBooking }: OrderSummaryProps) => {
  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 space-y-6">
        <section className="card-surface p-6 shadow-xl border-primary/5">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <h2 className="text-base font-black uppercase tracking-widest text-ink leading-none">Your Cart</h2>
              </div>
            </div>
            {cart.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/20">
                {cart.length}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-muted/50">
                <Package className="h-8 w-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No gear selected</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2.5">
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-line hover:border-primary/20 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                          <img src={item.image} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black truncate max-w-[130px] leading-tight text-ink">{item.name}</p>
                          <p className="text-[9px] text-muted uppercase font-black tracking-widest mt-1.5">{item.unique_code}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted/40 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="rounded-2xl border border-line p-5 space-y-4 bg-slate-50/50 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">Items for Handover</span>
                  <span className="text-lg font-black text-ink">{cart.length}</span>
                </div>
                <div className="pt-4 border-t border-line flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">Status</span>
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-amber-600 border border-amber-100">
                    <Clock className="h-3 w-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProcessBooking}
                className="w-full primary-button h-14 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
              >
                Confirm Booking
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-5 bg-blue-50/30 border-blue-100 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 border border-white shadow-sm">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Collection Policy</h3>
              <p className="text-[10px] leading-relaxed text-blue-800/80 font-bold">
                ID verification and photo proof are mandatory during release. Rep name must be recorded.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
};
