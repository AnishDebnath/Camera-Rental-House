import { CheckCheck, Heart, ShoppingBag, ShieldCheck, Sparkles, Box } from 'lucide-react';
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
    <div className="page-animate app-shell pb-40 pt-2 lg:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">

        {/* Left Column: Image Gallery */}
        <div className="space-y-6">
          <ImageCarousel images={product.images} />
        </div>

        {/* Right Column: Information (Sticky on Desktop) */}
        <div className="lg:sticky lg:top-28 space-y-3.5 mt-6 lg:mt-0 px-4 md:px-0">

          {/* Row 1: Gear & Brand Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-line bg-card/50 p-1 pr-3 transition-all">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm border border-line/50 p-1">
                <img src={CATEGORY_ICONS[product.category] || cameraIcon} alt="" className="h-full w-full object-contain" />
              </div>
              <span className="text-xs font-bold text-ink">{product.category}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-line bg-card/50 p-1 pr-3 transition-all">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm border border-line/50 p-1">
                <img src={BRAND_ICONS[product.brand] || sonyIcon} alt="" className="h-full w-full object-contain" />
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
                <p className="text-xs font-black text-ink uppercase">Verified Gear</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
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
                <span>Added to Rent Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                <span>Confirm Rental</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Nav Link Area */}
      <div className="mx-1 overflow-hidden rounded-[40px] bg-primary/5 border border-primary/10 p-8 flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default ProductDetail;
