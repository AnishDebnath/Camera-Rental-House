import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, Trash2, ChevronRight, Info } from 'lucide-react';

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
              <div className="max-h-[400px] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] overscroll-contain pr-2 custom-scrollbar space-y-2.5">
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-slate-50 shadow-sm">
                        <img src={item.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black leading-tight text-ink line-clamp-1">{item.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{item.unique_code}</span>
                          <div className="h-2.5 w-[1px] bg-line" />
                          <span className="text-[10px] font-black text-primary">₹{item.price_per_day}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-danger hover:text-white active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t border-line/60">
                <div className="flex items-center justify-between mb-5 px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted leading-none">Total Gear</span>
                    <span className="text-sm font-black text-ink mt-1.5">{cart.length} Items</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted leading-none">Daily Total</span>
                    <span className="text-xl font-black text-primary mt-1.5 tracking-tight">₹{cart.reduce((sum, item) => sum + (Number(item.price_per_day) || 0), 0)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProcessBooking}
                  className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-ink text-white shadow-xl shadow-ink/10 transition-all hover:bg-primary hover:shadow-primary/20 active:scale-[0.98]"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Generate Rental Order</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 bg-sky-50/50 border border-sky-100 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-500 border border-sky-100 shadow-sm">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-sky-900 uppercase tracking-widest">Collection Policy</h3>
              <p className="text-[10px] leading-relaxed text-sky-800/70 font-bold">
                ID verification and rep photo proof mandatory during release. Ensure all serial numbers match the generated order sheet.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
};
