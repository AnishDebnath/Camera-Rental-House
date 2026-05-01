import { useState } from 'react';
import { Phone, Package, Calendar, ChevronDown, ChevronUp, IndianRupee, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

type Rental = {
  id: string;
  name: string;
  user_image?: string;
  phone: string;
  pickup: string;
  return_date: string;
  total_price: number;
  status: string;
  products: Product[];
};

type RentalCardProps = {
  rentals: Rental[];
  activeTab: 'upcoming' | 'active' | 'returning';
};

const RentalItem = ({ rental, activeTab }: { rental: Rental; activeTab: 'upcoming' | 'active' | 'returning' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'upcoming') return 'bg-sky-50 text-sky-600 border-sky-100';
    if (s === 'active') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (s === 'returning') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'cancelled') return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const productSummary = rental.products.map(p => p.name).join(', ');
  const totalItems = rental.products.reduce((sum, p) => sum + (p.qty || 1), 0);

  const getDays = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(diff / (1000 * 3600 * 24)) + 1;
  };
  const durationDays = getDays(rental.pickup, rental.return_date);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.article
      layout
      className={`card-surface overflow-hidden transition-all duration-300 border ${isExpanded ? 'border-transparent shadow-cardHover' : 'border-line hover:border-transparent hover:shadow-cardHover'}`}
    >
      <div
        className="cursor-pointer p-4 md:p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Top Header: ID & Expansion */}
        <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-slate-50 px-3 py-1.5 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Rental ID:</span>
            <span className="font-mono text-sm font-black text-primary">#{rental.id}</span>
          </div>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isExpanded ? 'bg-ink border-ink text-white rotate-180 shadow-md' : 'bg-white border-line text-ink hover:bg-slate-50 hover:border-line/80 shadow-sm'
            }`}>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Main Body */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Customer Info */}
          <div className="flex items-center gap-4 lg:w-[25%] lg:shrink-0">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-slate-50 shadow-sm ring-1 ring-line/40">
              {rental.user_image ? (
                <img src={rental.user_image} alt={rental.name} className="h-full w-full object-cover" />
              ) : (
                <User className="m-auto mt-3 h-7 w-7 text-muted" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink truncate">{rental.name}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                <Phone className="h-3 w-3" /> {rental.phone}
              </p>
            </div>
          </div>

          {/* Dates - Premium Timeline Widget */}
          <div className="flex w-full items-center justify-center lg:flex-1">
            <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-1.5 border border-line/60 shadow-sm lg:w-auto lg:justify-start">

              {/* Pickup */}
              <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-colors ${activeTab === 'upcoming' ? 'bg-sky-50 shadow-sm ring-1 ring-sky-100/50' :
                activeTab === 'active' ? 'bg-orange-50 shadow-sm ring-1 ring-orange-100/50' :
                  'bg-transparent'
                }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${activeTab === 'upcoming' ? 'text-sky-600' : activeTab === 'active' ? 'text-orange-600' : 'text-tertiary'
                  }`}>
                  <Calendar className="h-3 w-3" /> Pickup
                </span>
                <span className={`mt-1 text-xs sm:text-sm font-bold ${activeTab === 'upcoming' ? 'text-sky-700' : activeTab === 'active' ? 'text-orange-700' : 'text-ink'
                  }`}>
                  {formatDate(rental.pickup)}
                </span>
              </div>

              {/* Connector (Duration) */}
              <div className="flex flex-col items-center px-2 sm:px-4 shrink-0">
                <div className="flex items-center w-full">
                  <div className="h-[2px] w-3 sm:w-6 bg-line/60 rounded-l-full" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted shadow-sm ring-2 ring-slate-50" />
                  <div className="h-[2px] w-3 sm:w-6 bg-line/60 rounded-r-full" />
                </div>
                <span className="mt-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted">
                  {durationDays} Days
                </span>
              </div>

              {/* Return */}
              <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-colors ${activeTab === 'returning' ? 'bg-emerald-50 shadow-sm ring-1 ring-emerald-100/50' :
                activeTab === 'active' ? 'bg-orange-50 shadow-sm ring-1 ring-orange-100/50' :
                  'bg-transparent'
                }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${activeTab === 'returning' ? 'text-emerald-600' : activeTab === 'active' ? 'text-orange-600' : 'text-tertiary'
                  }`}>
                  <Calendar className="h-3 w-3" /> Return
                </span>
                <span className={`mt-1 text-xs sm:text-sm font-bold ${activeTab === 'returning' ? 'text-emerald-700' : activeTab === 'active' ? 'text-orange-700' : 'text-ink'
                  }`}>
                  {formatDate(rental.return_date)}
                </span>
              </div>

            </div>
          </div>

          {/* Price & Status Block */}
          <div className="flex items-center justify-center lg:w-[25%] lg:justify-end lg:shrink-0">
            <div className="flex items-center gap-3 rounded-full border border-line bg-slate-50/50 p-1.5 shadow-sm transition-all hover:bg-slate-50 pr-4">
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(rental.status)}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                {rental.status}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-primary opacity-60 font-mono">₹</span>
                <span className="text-base font-black tracking-tight text-primary leading-none">
                  {rental.total_price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50/80 p-2 pr-3 border border-line/60 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-line/40">
                <Package className="h-4 w-4 text-ink" />
              </div>
              <p className="text-xs font-semibold text-ink truncate opacity-90">{productSummary}</p>
            </div>
            <div className="flex items-center shrink-0">
              <div className="h-1 w-1 rounded-full bg-line mr-3 hidden sm:block" />
              <span className="shrink-0 rounded-lg bg-white border border-line px-2.5 py-1 text-[10px] font-black tracking-widest text-ink shadow-sm">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="bg-slate-50/50"
          >
            <div className="px-4 md:px-6">
              <div className="h-px w-full bg-line" />
            </div>
            <div className="p-4 md:p-6 pt-6 md:pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-tertiary">Detailed Rental Breakdown</h4>
                <div className="mx-4 h-px flex-1 bg-line/60" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {rental.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-[1.25rem] bg-white p-3 shadow-sm border border-line/40 transition-hover hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-slate-50">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{product.name}</p>
                        <p className="text-[10px] font-bold text-muted mt-0.5">₹{product.price.toLocaleString()} × {product.qty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">₹{(product.price * product.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Total Amount</span>
                    <span className="text-lg font-black leading-tight text-primary">₹{rental.total_price.toLocaleString()}</span>
                  </div>
                </div>
                <button className={`rounded-xl px-6 py-2.5 text-xs font-black text-white shadow-lg transition-all active:scale-95 ${activeTab === 'upcoming' ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20' :
                  activeTab === 'returning' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' :
                    'bg-ink hover:bg-ink/90 shadow-ink/10'
                  }`}>
                  {activeTab === 'upcoming' ? 'Handover Products' :
                    activeTab === 'returning' ? 'Process Return' :
                      'Manage Order'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

const RentalCard = ({ rentals, activeTab }: RentalCardProps) => {
  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <RentalItem key={rental.id} rental={rental} activeTab={activeTab} />
      ))}
    </div>
  );
};

export default RentalCard;
