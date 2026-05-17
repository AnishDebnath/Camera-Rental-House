import { Heart, ShoppingBag, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useFavourites } from '../../store/FavouritesContext';
import formatCurrency from '../../utils/formatCurrency';
import { BRAND_ICONS, CATEGORY_ICONS } from '../../../../../packages/data/categories';

import { LazyImage } from '@camera-rental-house/ui';

const ProductCard = ({ product }) => {
  const { items, addToCart, removeFromCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  const inCart = items.some((item) => item.id === product.id);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[26px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 md:hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] md:hover:-translate-y-1 w-full"
    >
      {/* Edge-to-edge floating Image Container */}
      <div className="p-2.5 pb-0">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[18px] bg-slate-50 border border-slate-100 shadow-inner">
          <Link to={`/product/${product.id}`} className="absolute inset-0 z-0">
            <LazyImage
              src={product.images[0]?.image_url}
              alt={product.name}
              aspectRatio="aspect-auto h-full w-full"
              className="transition-transform duration-700 ease-out md:group-hover:scale-105"
            />
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavourite(product);
            }}
            aria-label="Toggle favourite"
            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-md border border-slate-100 transition-all active:scale-90 md:hover:scale-110 md:hover:bg-white text-slate-600"
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${isFavourite(product.id) ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 pt-2.5 z-10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1">
              {product.category && (
                <img
                  src={CATEGORY_ICONS[product.category] || CATEGORY_ICONS[product.category.endsWith('s') ? product.category : `${product.category}s`]}
                  alt=""
                  className="h-3 w-3 object-contain"
                />
              )}
              {product.category}
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1">
              {product.brand && (
                <img
                  src={BRAND_ICONS[product.brand] || BRAND_ICONS[Object.keys(BRAND_ICONS).find(k => k.toLowerCase() === product.brand?.toLowerCase()) || '']}
                  alt=""
                  className="h-3 w-3 object-contain"
                />
              )}
              {product.brand}
            </span>
          </div>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="line-clamp-2 h-[2.5em] text-xs font-bold leading-tight text-slate-800 md:text-sm transition-colors md:group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex flex-col justify-end">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
            <div className="flex items-baseline gap-1 order-2 sm:order-1">
              <span className="text-base font-extrabold tracking-tight text-primary md:text-lg leading-none">
                {formatCurrency(product.price_per_day)}
              </span>
              <span className="text-[10px] font-bold tracking-wider text-slate-400">
                / Per Day
              </span>
            </div>
            {product.unique_code && (
              <span className="text-[10px] font-mono font-black text-primary bg-primary/5 px-2 py-0.5 rounded-[6px] border border-primary/10 shrink-0 self-start sm:self-auto order-1 sm:order-2">
                {product.unique_code}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.available_quantity > 0) {
                if (inCart) {
                  removeFromCart(product.id);
                } else {
                  addToCart(product);
                }
              }
            }}
            disabled={product.available_quantity === 0}
            className={`flex h-9 w-full items-center justify-center gap-2 rounded-[12px] px-3 text-[11px] font-bold shadow-sm transition-all active:scale-95 
              ${product.available_quantity === 0
                ? 'bg-danger/10 text-danger border border-danger/20 cursor-not-allowed'
                : inCart
                  ? 'bg-success/10 text-success border border-success/20 md:hover:bg-success/20'
                  : 'bg-slate-900 border border-slate-800 text-white md:hover:bg-primary md:hover:border-primary md:hover:shadow-[0_4px_12px_rgba(255,107,0,0.2)]'
              }`}
          >
            {product.available_quantity === 0 ? (
              <>
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Out of Stock</span>
              </>
            ) : inCart ? (
              <>
                <CheckCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Added in Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Add to Rent</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
