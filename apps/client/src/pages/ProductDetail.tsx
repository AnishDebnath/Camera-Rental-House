import { ArrowLeft, CheckCheck, Heart, Info, QrCode, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../store/CartContext';
import { useFavourites } from '../store/FavouritesContext';
import formatCurrency from '../utils/formatCurrency';

// Asset imports
import canonIcon from '../assets/brands/canon.png';
import leicaIcon from '../assets/brands/leica.png';
import nikonIcon from '../assets/brands/nikon.png';
import sonyIcon from '../assets/brands/sony.png';
import zeissIcon from '../assets/brands/zeiss.png';

import cameraIcon from '../assets/categories/camera.png';
import lenseIcon from '../assets/categories/lense.png';
import lightIcon from '../assets/categories/light.png';
import micIcon from '../assets/categories/mic.png';
import tripodIcon from '../assets/categories/tripod.png';

const BRAND_ICONS: Record<string, string> = {
  Canon: canonIcon,
  Leica: leicaIcon,
  Nikon: nikonIcon,
  Sony: sonyIcon,
  Zeiss: zeissIcon,
};

const CATEGORY_ICONS: Record<string, string> = {
  Camera: cameraIcon,
  Lense: lenseIcon,
  Light: lightIcon,
  Audio: micIcon,
  Tripod: tripodIcon,
  Drones: cameraIcon, // Fallback
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  const product = mockProducts.find((item) => item.id === id) || mockProducts[0];
  const inCart = items.some((item) => item.id === product.id);

  return (
    <div className="page-animate app-shell space-y-4 pb-40 pt-2">
      {/* Page Header Area - Matches other page start positions */}
      {/* <div>
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2.5 group group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white shadow-sm transition-all active:scale-90 group-hover:border-primary/50">
            <ArrowLeft className="h-5 w-5 text-ink/70 transition-transform group-hover:-translate-x-1" />
          </div>
          <span className="text-sm font-bold text-muted transition-colors group-hover:text-ink">Back to Collection</span>
        </button>
      </div> */}

      {/* Hero Carousel */}
      <ImageCarousel images={product.images} />

      {/* Product Info Section */}
      <section className="space-y-8 px-1">
        {/* Status, Gear & Brand Tags */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stock Status Badge */}
          <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2 bg-card/50 transition-all ${product.available_quantity > 0 ? 'border-success/30' : 'border-danger/30'
            }`}>
            <div className={`h-2 w-2 rounded-full ${product.available_quantity > 0 ? 'bg-success animate-pulse' : 'bg-danger'
              }`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${product.available_quantity > 0 ? 'text-success' : 'text-danger'
              }`}>
              {product.available_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-card/50 p-1.5 pr-4 transition-all hover:border-primary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-line/50 p-1.5">
              <img src={CATEGORY_ICONS[product.category] || cameraIcon} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Gear Type</span>
              <span className="text-sm font-bold text-ink">{product.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-card/50 p-1.5 pr-4 transition-all hover:border-primary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-line/50 p-1.5">
              <img src={BRAND_ICONS[product.brand] || sonyIcon} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Brand</span>
              <span className="text-sm font-bold text-ink">{product.brand}</span>
            </div>
          </div>
        </div>

        {/* Title & Price */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold leading-tight text-ink md:text-4xl">{product.name}</h2>
            <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-xl border border-line bg-white/50">
              <QrCode className="h-5 w-5 text-muted" />
            </div>
          </div>

          <div className="flex items-end gap-3 border-b border-line pb-6">
            <p className="text-3xl font-black text-primary md:text-4xl">
              {formatCurrency(product.price_per_day)}
            </p>
            <span className="mb-1 text-sm font-semibold text-muted uppercase tracking-wider">/ Day</span>
            <div className="ml-auto flex items-center gap-2 rounded-lg bg-page px-3 py-1.5 text-[10px] font-bold text-muted uppercase border border-line/50">
              ID: <span className="text-ink">{product.product_code || `#${product.id.padStart(4, '0')}`}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-ink">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Description</h3>
          </div>
          <p className="text-base leading-relaxed text-muted/90 md:text-lg">
            {product.description}
          </p>
        </div>

        {/* Features / Details Placeholder */}
        <div className="grid grid-cols-2 gap-4 rounded-[32px] border border-line bg-card/30 p-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Availability</p>
            <p className={`text-sm font-bold ${product.available_quantity > 0 ? 'text-success' : 'text-danger'}`}>
              {product.available_quantity > 0 ? 'Now Available' : 'Currently Rented'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Condition</p>
            <p className="text-sm font-bold text-ink">Excellent (Mint)</p>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed inset-x-0 bottom-6 z-40 px-4 md:bottom-8">
        <div className="mx-auto flex max-w-4xl gap-3 rounded-[32px] border border-white/20 bg-ink/90 p-3 shadow-2xl backdrop-blur-xl transition-all hover:bg-ink">
          <button
            type="button"
            onClick={() => toggleFavourite(product)}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all active:scale-95 ${isFavourite(product.id) ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            <Heart className={`h-6 w-6 ${isFavourite(product.id) ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={product.available_quantity === 0}
            className={`flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl px-6 font-bold text-white transition-all active:scale-[0.98] ${product.available_quantity === 0
              ? 'bg-muted/30 cursor-not-allowed opacity-50'
              : 'bg-primary shadow-lg shadow-primary/30 hover:bg-primary-hover hover:translate-y-[-1px]'
              }`}
          >
            {inCart ? (
              <>
                <CheckCheck className="h-5 w-5" />
                <span>In Your Rent Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                <span>Add to Rent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Cart Link */}
      <div className="mx-1 overflow-hidden rounded-[32px] bg-primary/5 border border-primary/10 p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold text-ink">Ready to checkout?</p>
          <p className="text-xs text-muted">View your selected gear and confirm dates.</p>
        </div>
        <Link
          to="/cart"
          className="flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-bold text-primary shadow-sm border border-line hover:border-primary/50 transition-all active:scale-95"
        >
          Review Cart
        </Link>
      </div>
    </div>
  );
};


export default ProductDetail;
