import { ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import axiosInstance from '../../api/axiosInstance';

const FeaturedGear = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products?limit=8');
        const mappedProducts = data.items.map((p: any) => ({
          ...p,
          images: (p.images || []).map((url: string, i: number) => ({
            id: String(i),
            image_url: url,
            display_order: i
          }))
        }));
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="app-shell space-y-4">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-xl font-bold text-ink md:text-2xl">
            Available Now
          </h2>
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
        {products.map((product, index) => (
          <div key={product.id} className={index >= 6 ? 'hidden lg:block' : 'block'}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGear;
