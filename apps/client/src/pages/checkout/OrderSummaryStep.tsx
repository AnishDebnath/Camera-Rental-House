import { motion } from 'framer-motion';
import formatCurrency from '../../utils/formatCurrency';
import LoadingButton from '../../components/LoadingButton';

interface OrderSummaryStepProps {
  items: any[];
  totalDays: number;
  subtotal: number;
  totalCost: number;
  loading: boolean;
  onPrev: () => void;
  onConfirm: () => void;
}

const OrderSummaryStep = ({ items, totalDays, subtotal, totalCost, loading, onPrev, onConfirm }: OrderSummaryStepProps) => {
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Item List */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/50 p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink">Gear Selected</h2>
              <p className="text-xs text-muted font-medium">{items.length} premium items in your batch.</p>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-[1.2rem] border border-white bg-white/60 transition-all duration-300 hover:shadow-md">
                <img
                  src={item.images?.[0]?.image_url}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover shrink-0 border border-line/50 shadow-sm"
                />
                <div className="flex-1 py-1">
                  <p className="text-sm font-bold text-ink line-clamp-1">{item.name}</p>
                  <p className="text-xs font-medium text-muted mt-0.5">{item.brand} • {item.category}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-[10px] text-muted font-bold tracking-tight">
                      {formatCurrency(item.price_per_day)} <span className="text-[9px] font-bold uppercase opacity-60">/ Day</span>
                    </p>
                    <p className="text-sm font-bold text-ink">
                      {formatCurrency(item.price_per_day * totalDays)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Calculation */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/50 p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-sm space-y-8 lg:sticky lg:top-28">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/60 p-4 rounded-[1.2rem] border border-white shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Rental Duration</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{totalDays} Days</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest text-right">Items</p>
                <p className="text-sm font-semibold text-ink mt-0.5">x{items.length}</p>
              </div>
            </div>

            <div className="p-1 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted">Daily Subtotal</span>
                <span className="font-bold text-ink">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted">Service Fee</span>
                <span className="font-bold text-success">Included</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted">Duration Multiplier</span>
                <span className="font-bold text-ink">x {totalDays}</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-line">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Final Total</p>
                  <p className="text-3xl font-bold text-ink tracking-tighter">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
                <div className="mb-1">
                  <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-success border border-success/20">
                    Insurance included
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <LoadingButton
              loading={loading}
              onClick={onConfirm}
              className="!h-16 !text-sm !font-bold !rounded-[2rem] shadow-xl shadow-primary/20"
            >
              Confirm & Reserve Rent
            </LoadingButton>
            <button
              onClick={onPrev}
              className="w-full text-sm font-bold text-muted hover:text-ink transition-colors"
            >
              Modify Dates
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderSummaryStep;
