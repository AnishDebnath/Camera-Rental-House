import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronRight, ShieldCheck, Loader2, Store, Phone } from 'lucide-react';
import { mockHouses } from '../houses/index';

interface PartnerSelectionProps {
  selectedHouse: any;
  setSelectedHouse: (house: any) => void;
  houseId: string | null;
}

export const PartnerSelection = ({ selectedHouse, setSelectedHouse, houseId }: PartnerSelectionProps) => {
  return (
    <section>
      <AnimatePresence mode="wait">
        {!selectedHouse ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {mockHouses.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHouse(h)}
                className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 text-left hover:border-primary/30 hover:bg-slate-50 transition-all group shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-line group-hover:bg-white group-hover:scale-105 transition-all duration-300">
                  <Building2 className="h-6 w-6 text-muted group-hover:text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-ink leading-tight truncate">{h.name}</p>
                  <p className="text-[10px] font-bold text-muted uppercase mt-1 tracking-wider">{h.ownerName}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-surface p-6 overflow-hidden relative"
          >
            {/* Decorative element */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
              <div className="flex items-center gap-5">
                <div className="relative h-16 w-16 shrink-0">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-sm border border-indigo-100/50">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-sm ${selectedHouse.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {selectedHouse.status === 'Active' ? <ShieldCheck className="h-3 w-3 text-white" /> : <Loader2 className="h-3 w-3 text-white animate-spin" />}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-ink tracking-tight">{selectedHouse.name}</h3>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-bold text-muted">
                    <div className="flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-primary/60" />
                      <span>{selectedHouse.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-sky-500/60" />
                      <span>{selectedHouse.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
