import { Sparkles, ShieldCheck } from 'lucide-react';
import formatCurrency from '../../utils/formatCurrency';

import { BRAND_ICONS, CATEGORY_ICONS, } from '../../data/categories';

interface ProductInfoProps {
  product: any;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="space-y-3.5">
      {/* Row 1: Gear & Brand Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-card/50 p-1 pr-3 transition-all">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm border border-line/50 p-1">
            <img src={CATEGORY_ICONS[product.category]} alt="" className="h-full w-full object-contain" />
          </div>
          <span className="text-xs font-bold text-ink">{product.category}</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-card/50 p-1 pr-3 transition-all">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm border border-line/50 p-1">
            <img src={BRAND_ICONS[product.brand]} alt="" className="h-full w-full object-contain" />
          </div>
          <span className="text-xs font-bold text-ink">{product.brand}</span>
        </div>
      </div>

      {/* Row 2: Product Name */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black leading-tight text-ink md:text-3xl xl:text-4xl tracking-tight">
          {product.name}
        </h1>
      </div>

      {/* Row 3: Product ID */}
      <div className="flex">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 border border-line/50">
          <span className="text-[9px] font-bold text-muted uppercase tracking-widest mr-1 text-ink/40">Product Code:</span>
          <span className="text-xs font-black text-ink">{product.product_code || `#${product.id.padStart(4, '0')}`}</span>
        </div>
      </div>

      {/* Row 4: Price */}
      <div className="space-y-1">
        <div className="flex items-end gap-2">
          <p className="text-2xl font-black text-primary md:text-3xl">
            {formatCurrency(product.price_per_day)}
          </p>
          <span className="mb-1 text-[10px] font-bold text-muted uppercase tracking-widest">/ Per day</span>
        </div>
      </div>

      {/* Row 5: Availability */}
      <div className="flex">
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2 bg-card/30 transition-all ${product.available_quantity > 0 ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'
          }`}>
          <div className={`h-2 w-2 rounded-full ${product.available_quantity > 0 ? 'bg-success animate-pulse' : 'bg-danger'
            }`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${product.available_quantity > 0 ? 'text-success' : 'text-danger'
            }`}>
            {product.available_quantity > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Row 6: Description */}
      <div className="max-w-4xl space-y-3 border-t border-black/10 pt-5">
        <div className="flex items-center gap-2 text-ink">
          <div className="h-1 w-6 bg-primary rounded-full" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Detailed Overview</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted/90 md:text-base font-medium">
          {product.description}
        </p>
      </div>

      {/* Specs / Attributes Grid */}
      <div className="grid grid-cols-2 gap-3 py-2">
        <div className="flex items-center gap-3 rounded-2xl border border-line/40 bg-white/40 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Condition</p>
            <p className="text-xs font-black text-ink uppercase">Excellent</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-line/40 bg-white/40 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/5 text-success">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Trust</p>
            <p className="text-xs font-black text-ink uppercase">Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
