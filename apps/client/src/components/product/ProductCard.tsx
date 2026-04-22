import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useFavourites } from '../../store/FavouritesContext';
import formatCurrency from '../../utils/formatCurrency';

import LazyImage from '../feature/LazyImage';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[26px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 w-full"
    >
      {/* Edge-to-edge floating Image Container */}
      <div className="p-2.5 pb-0">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[18px] bg-slate-50 border border-slate-100 shadow-inner">
          <Link to={`/product/${product.id}`} className="absolute inset-0 z-0">
            <LazyImage
              src={product.images[0]?.image_url}
              alt={product.name}
              aspectRatio="aspect-auto h-full w-full"
              className="transition-transform duration-700 ease-out group-hover:scale-105"
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
            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-md border border-slate-100 transition-all active:scale-90 hover:scale-110 hover:bg-white text-slate-600"
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${isFavourite(product.id) ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 pt-2.5 z-10">
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            {product.category}
          </p>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="line-clamp-2 h-[2.5em] text-xs font-bold leading-tight text-slate-800 md:text-sm transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex flex-col justify-end">
          <div className="flex items-baseline gap-1 mb-2.5">
            <span className="text-base font-extrabold tracking-tight text-primary md:text-lg leading-none">
              {formatCurrency(product.price_per_day)}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-slate-400">
              / Per Day
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[12px] bg-slate-900 border border-slate-800 px-3 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-primary hover:border-primary hover:shadow-[0_4px_12px_rgba(255,107,0,0.2)] active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Add to Rent</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
