import { Package, Plus, Check } from 'lucide-react';
import { BRAND_ICONS, CATEGORY_ICONS } from '../../../../../../packages/data/categories';

interface BookingProductCardProps {
  product: any;
  isInCart: boolean;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
}

export const BookingProductCard = ({
  product,
  isInCart,
  addToCart,
  removeFromCart
}: BookingProductCardProps) => {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-line bg-white transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
      <div className="flex gap-4 p-4">
        {/* Image Section */}
        <div className="relative h-20 w-20 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-xl border border-line bg-slate-50">
            <img src={product.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-sm font-black text-ink line-clamp-2 tracking-tight min-h-[2.5rem]">{product.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              ID: {product.unique_code}
            </span>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest ${product.available_quantity > 0 ? 'bg-success/10 text-emerald-700' : 'bg-warning/10 text-amber-600'
              }`}>
              {product.available_quantity > 0 ? 'In Stock' : 'On Rent'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-50 border border-line p-0.5">
                {CATEGORY_ICONS[product.category] && <img src={CATEGORY_ICONS[product.category]} alt="" className="h-full w-full object-contain" />}
              </div>
              <span className="text-[11px] font-medium text-muted truncate">{product.category}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white border border-line p-0.5">
                {BRAND_ICONS[product.brand] && <img src={BRAND_ICONS[product.brand]} alt="" className="h-full w-full object-contain" />}
              </div>
              <span className="text-[11px] font-bold text-ink truncate">{product.brand}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-[1px] bg-line/50" />

      {/* Footer Section */}
      <div className="mt-auto p-4 pt-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-muted uppercase tracking-widest">Price per day</span>
          <p className="text-sm font-black text-primary">₹{product.price_per_day}</p>
        </div>
        <button
          onClick={() => isInCart ? removeFromCart(product.id) : addToCart(product)}
          disabled={product.available_quantity === 0 && !isInCart}
          className={`group/btn flex h-8 px-3 items-center gap-1.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${isInCart
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105'
            } text-[10px] font-black uppercase tracking-widest`}
        >
          {isInCart ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5 transition-transform group-hover/btn:rotate-90" />
          )}
          <span>{isInCart ? 'Added in Cart' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
