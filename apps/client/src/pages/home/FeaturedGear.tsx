import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { mockProducts } from '../../data/mockProducts';

const FeaturedGear = () => {
  return (
    <section className="app-shell space-y-4">
      <div className="flex items-center justify-between pl-4">
        <div>
          <h2 className="text-xl font-semibold text-ink md:text-2xl">
            Available Now
          </h2>
          {/* <p className="text-sm text-muted">Fast-moving kits ready for pickup.</p> */}
        </div>
        <Link
          to="/category"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          See All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {mockProducts.slice(0, 8).map((product, index) => (
          <div key={product.id} className={index >= 6 ? 'hidden lg:block' : 'block'}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGear;
