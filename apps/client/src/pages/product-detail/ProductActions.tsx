import { createPortal } from 'react-dom';
import { Heart, ShoppingBag, CheckCheck, ShieldCheck } from 'lucide-react';

interface ProductActionsProps {
  product: any;
  inCart: boolean;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (product: any) => void;
  handleCartAction: () => void;
}

const ProductActions = ({
  product,
  inCart,
  isFavourite,
  toggleFavourite,
  handleCartAction
}: ProductActionsProps) => {
  return (
    <>
      {/* Desktop Actions (Exact BottomNav Liquid Glass) */}
      <div className="hidden lg:block pt-6">
        <div className="relative flex items-center gap-3 p-3 rounded-[3rem] bg-gradient-to-r from-blue-500/20 to-blue-300/20 shadow-[0_20px_50px_rgba(31,_38,_135,_0.1)] backdrop-blur-[40px] pointer-events-auto border border-white/60 ring-1 ring-black/[0.02] before:absolute before:inset-0 before:rounded-[3rem] before:bg-gradient-to-br before:from-white/40 before:to-transparent before:p-[1px] before:-z-10 overflow-hidden">
          {/* Subtle Liquid Highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[3rem]" />

          <button
            type="button"
            onClick={() => toggleFavourite(product)}
            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all active:scale-95 ${isFavourite(product.id)
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
              : 'border-white/60 bg-white/40 text-ink hover:border-primary/40 hover:text-primary shadow-sm'
              }`}
          >
            <Heart className={`h-5 w-5 ${isFavourite(product.id) ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCartAction}
            disabled={product.available_quantity === 0}
            className={`relative z-10 flex h-12 flex-1 items-center justify-center gap-3 rounded-full transition-all active:scale-[0.98] ${product.available_quantity === 0
              ? 'bg-danger/10 text-danger border border-danger/20 cursor-not-allowed font-bold'
              : inCart
                ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20 shadow-sm font-bold'
                : 'bg-primary shadow-lg shadow-primary/25 hover:bg-primary-hover hover:translate-y-[-1px] hover:shadow-xl hover:shadow-primary/20 font-black text-white'
              }`}
          >
            {product.available_quantity === 0 ? (
              <>
                <ShoppingBag className="h-4.5 w-4.5" />
                <span className="uppercase tracking-[0.1em] text-[10px]">Out of Stock</span>
              </>
            ) : inCart ? (
              <>
                <CheckCheck className="h-4.5 w-4.5" />
                <span className="uppercase tracking-[0.1em] text-[10px]">Added in Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4.5 w-4.5" />
                <span className="uppercase tracking-[0.1em] text-[10px]">Add to Rent</span>
              </>
            )}
          </button>
        </div>
        <p className="mt-3 px-3 text-[10px] font-medium text-muted/80 text-center flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <ShieldCheck className="h-3 w-3 text-success" /> Fully Insured & Verified Hardware
        </p>
      </div>

      {createPortal(
        <div className="fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4 lg:hidden">
          <div className="relative flex h-16 w-full max-w-[420px] items-center gap-2 rounded-[3rem] bg-gradient-to-r from-blue-500/20 to-blue-300/20 shadow-[0_20px_50px_rgba(31,_38,_135,_0.1)] backdrop-blur-[40px] pointer-events-auto border border-white/60 ring-1 ring-black/[0.02] before:absolute before:inset-0 before:rounded-[3rem] before:bg-gradient-to-br before:from-white/40 before:to-transparent before:p-[1px] before:-z-10 overflow-hidden p-2">
            {/* Subtle Liquid Highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[3rem]" />

            <button
              type="button"
              onClick={() => toggleFavourite(product)}
              className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all active:scale-95 ${isFavourite(product.id)
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/40 border-white/60 text-ink hover:bg-white/60 shadow-sm'
                }`}
            >
              <Heart className={`h-5 w-5 ${isFavourite(product.id) ? 'fill-white' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleCartAction}
              disabled={product.available_quantity === 0}
              className={`relative z-10 flex h-12 flex-1 items-center justify-center gap-3 rounded-full transition-all active:scale-[0.98] ${product.available_quantity === 0
                ? 'bg-danger/10 text-danger border border-danger/20 cursor-not-allowed font-bold'
                : inCart
                  ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20 shadow-sm font-bold'
                  : 'bg-primary shadow-md shadow-primary/30 hover:bg-primary-hover font-black text-white'
                }`}
            >
              {product.available_quantity === 0 ? (
                <>
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">Out of Stock</span>
                </>
              ) : inCart ? (
                <>
                  <CheckCheck className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">Added in Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">Add to Rent</span>
                </>
              )}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProductActions;
