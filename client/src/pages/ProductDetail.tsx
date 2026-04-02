import { ArrowLeft, CheckCheck, Heart } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import formatCurrency from '../utils/formatCurrency';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const product = mockProducts.find((item) => item.id === id) || mockProducts[0];
  const inCart = items.some((item) => item.id === product.id);

  return (
    <div className="page-animate app-shell space-y-6 pb-36">
      <header className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="max-w-[60%] truncate text-base font-semibold text-ink">{product.name}</h1>
        <button type="button" onClick={() => toggleFavourite(product)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white">
          <Heart className={`h-5 w-5 ${isFavourite(product.id) ? 'fill-primary text-primary' : ''}`} />
        </button>
      </header>

      <ImageCarousel images={product.images} />

      <section className="card-surface space-y-5 p-5">
        <span className="inline-flex rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">{product.category}</span>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{product.name}</h2>
          <p className="text-2xl font-bold text-primary md:text-3xl">
            {formatCurrency(product.price_per_day)}
            <span className="ml-2 text-sm font-medium text-muted">per day</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-pill px-4 py-2 text-sm font-semibold ${product.available_quantity > 0 ? 'bg-primary text-white' : 'bg-danger/10 text-danger'}`}>
            {product.available_quantity > 0 ? 'Available' : 'Rented Out'}
          </span>
          <span className="text-sm text-muted">Quantity available: {product.available_quantity}</span>
        </div>
        <p className="text-sm leading-7 text-muted md:text-base">{product.description}</p>
      </section>

      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-line bg-white/95 px-4 py-4 backdrop-blur md:bottom-0 md:px-8">
        <div className="mx-auto flex max-w-4xl gap-3">
          <button type="button" onClick={() => toggleFavourite(product)} className="secondary-button flex-1">
            Add to Favourites
          </button>
          <button type="button" onClick={() => addToCart(product)} className="primary-button flex-1">
            {inCart ? (
              <span className="inline-flex items-center gap-2"><CheckCheck className="h-4 w-4" /> Added</span>
            ) : (
              'Add to Rent Cart'
            )}
          </button>
        </div>
      </div>

      <div className="card-surface flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-semibold text-ink">Need a quick checkout?</p>
          <p className="text-sm text-muted">Save this item to your cart and confirm rental dates later.</p>
        </div>
        <Link to="/cart" className="primary-button w-fit">
          Review Cart
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
