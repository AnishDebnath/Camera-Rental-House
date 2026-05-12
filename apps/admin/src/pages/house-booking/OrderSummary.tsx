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
          <div className="flex items-center gap-3 pb-4 border-b border-line/50 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100/50 shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black text-ink leading-none">Booking Summary</h2>
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
              <div className="max-h-[370px] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] overscroll-contain pr-2 custom-scrollbar space-y-2.5">
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

                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-[12px] font-black leading-tight text-ink line-clamp-2 tracking-tight">{item.name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                            {item.unique_code}
                          </span>
                          <span className="text-[11px] font-black text-primary tracking-tight">₹{item.price_per_day}</span>
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

              <div className="pt-4 border-t border-line/60 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between shadow-inner border border-line/30">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted leading-none">Total Gear</span>
                    <span className="text-sm font-black text-ink mt-2">{cart.length} Items</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted leading-none">Daily Total</span>
                    <span className="text-xl font-black text-primary mt-2">₹{cart.reduce((sum, item) => sum + (Number(item.price_per_day) || 0), 0)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProcessBooking}
                  className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 transition-all hover:bg-emerald-600 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative text-[12px] font-black uppercase tracking-[0.15em]">Generate Rental Order</span>
                  <ChevronRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
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
