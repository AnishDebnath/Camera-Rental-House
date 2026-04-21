import { useParams, Link } from 'react-router-dom';
import Footer from '../../components/common/footer/Footer';
import { mockProducts } from '../../data/mockProducts';
import { useCart } from '../../store/CartContext';
import { useFavourites } from '../../store/FavouritesContext';

// Section Components
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductActions from './ProductActions';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, items } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  const product = mockProducts.find((item) => item.id === id) || mockProducts[0];
  const inCart = items.some((item) => item.id === product.id);

  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      <div className="page-animate app-shell pb-10 md:pb-12 pt-2 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">

          {/* Left Column: Image Gallery */}
          <ProductGallery images={product.images} />

          {/* Right Column: Information & Actions */}
          <div className="lg:sticky lg:top-28 space-y-3.5 mt-6 lg:mt-0 px-4 lg:px-0">
            <ProductInfo product={product} />
            <ProductActions
              product={product}
              inCart={inCart}
              isFavourite={isFavourite}
              toggleFavourite={toggleFavourite}
              handleCartAction={handleCartAction}
            />

            {/* Footer Nav Link Area */}
            {/* <div className="mx-1 overflow-hidden rounded-[40px] bg-primary/5 border border-primary/10 p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-black text-ink">Plan your production.</p>
                <p className="text-sm text-muted">Proceed to cart to finalize dates and insurance.</p>
              </div>
              <Link
                to="/cart"
                className="flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-sm font-bold text-primary shadow-sm border border-line hover:border-primary/50 transition-all active:scale-95"
              >
                Review Cart
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
