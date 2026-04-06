import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useFavourites } from '../store/FavouritesContext';
import formatCurrency from '../utils/formatCurrency';

const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <article className={`card-surface overflow-hidden ${compact ? 'w-40 min-w-40 md:w-52 md:min-w-52' : 'w-full'}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-page">
        <img src={product.images[0]?.image_url} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-pill bg-primary-light px-3 py-1 text-[11px] font-medium text-primary-dark">
          {product.category}
        </span>
        <button type="button" onClick={() => toggleFavourite(product)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
          <Heart className={`h-4 w-4 ${isFavourite(product.id) ? 'fill-primary text-primary' : 'text-ink'}`} />
        </button>
      </div>
      <div className="space-y-3 p-4 md:p-5">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="line-clamp-2 text-sm font-semibold text-ink md:text-base">{product.name}</h3>
        </Link>
        <div>
          <p className="text-lg font-bold text-primary md:text-xl">{formatCurrency(product.price_per_day)}</p>
          <p className="text-xs text-muted">per day</p>
        </div>
        <button type="button" onClick={() => addToCart(product)} className="primary-button w-full">
          Add to Rent
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
