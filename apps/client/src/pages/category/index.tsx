import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryHeader from './CategoryHeader';
import CategoryProducts from './CategoryProducts';
import MobileFilters from './MobileFilters';
import Footer from '../../components/common/footer/Footer';
import axiosInstance from '../../api/axiosInstance';
import useDebounce from '../../hooks/useDebounce';
import usePullToRefresh from '../../hooks/usePullToRefresh';

const Category = () => {
  const [params, setParams] = useSearchParams();
  const initialSearch = params.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);

  const activeCategory = params.get('category') || 'All';
  const activeBrand = params.get('brand') || 'All';
  const debouncedSearch = useDebounce(search, 300);

  // Sync state with URL params
  useEffect(() => {
    const q = params.get('q');
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [params, search]);

  // Sync URL params with state
  useEffect(() => {
    const nextParams = new URLSearchParams(params);
    if (debouncedSearch) {
      nextParams.set('q', debouncedSearch);
    } else {
      nextParams.delete('q');
    }
    if (nextParams.toString() !== params.toString()) {
      setParams(nextParams, { replace: true });
    }
  }, [debouncedSearch, params, setParams]);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/products', {
        params: {
          category: activeCategory,
          brand: activeBrand,
          search: debouncedSearch,
          limit: itemsToShow
        }
      });
      
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
      console.error('Failed to fetch category products:', err);
    } finally {
      setLoading(false);
    }
  };

  const pullDistance = usePullToRefresh(refresh);

  useEffect(() => {
    refresh();
  }, [activeCategory, activeBrand, debouncedSearch, itemsToShow]);

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  const handleFilterSelect = (type: 'category' | 'brand', value: string) => {
    const nextParams = new URLSearchParams(params);
    if (value === 'All') {
      nextParams.delete(type);
    } else {
      nextParams.set(type, value);
    }
    setParams(nextParams);
  };

  return (
    <div className="min-h-screen">
      <CategoryHeader
        pullDistance={pullDistance}
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeCategory={activeCategory}
        activeBrand={activeBrand}
        onSelectFilter={handleFilterSelect}
      />
      <div className="app-shell mt-4 md:mt-6">
        <CategoryProducts
          loading={loading}
          filteredProducts={products}
          itemsToShow={itemsToShow}
          setItemsToShow={setItemsToShow}
        />
      </div>
      {!isDesktop && (
        <MobileFilters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          onSelectFilter={handleFilterSelect}
        />
      )}
      <div className="mt-12 md:mt-18">
        <Footer />
      </div>
    </div>
  );
};

export default Category;