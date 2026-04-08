import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { mockProducts } from '../../data/mockProducts';

const FeaturedGear = () => {
  return (
    <section className="app-shell space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink md:text-2xl">
            Available Now
          </h2>
          <p className="text-sm text-muted">Fast-moving kits ready for pickup.</p>
        </div>
        <Link
          to="/category"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          See All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
        {mockProducts.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGear;
