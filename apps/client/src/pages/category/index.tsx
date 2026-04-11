import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryHeader from './CategoryHeader';
import CategoryProducts from './CategoryProducts';
import MobileFilters from './MobileFilters';
import Footer from '../../components/common/footer/Footer';
import { mockProducts } from '../../data/mockProducts';
import useDebounce from '../../hooks/useDebounce';
import usePullToRefresh from '../../hooks/usePullToRefresh';

const Category = () => {
  const [params, setParams] = useSearchParams();
  const initialSearch = params.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8);

  const activeCategory = params.get('category') || 'All';
  const activeBrand = params.get('brand') || 'All';
  const debouncedSearch = useDebounce(search, 250);

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
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setLoading(false);
  };

  const pullDistance = usePullToRefresh(refresh);

  useEffect(() => {
    refresh();
  }, [activeCategory, activeBrand]);

  const filteredProducts = useMemo(
    () =>
      mockProducts.filter((product) => {
        const matchesCategory = activeCategory === 'All' ||
          product.category === activeCategory ||
          product.name.toLowerCase().includes(activeCategory.toLowerCase());

        const matchesBrand = activeBrand === 'All' ||
          product.name.toLowerCase().includes(activeBrand.toLowerCase());

        const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());

        return matchesCategory && matchesBrand && matchesSearch;
      }),
    [activeCategory, activeBrand, debouncedSearch],
  );

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
      <div className="app-shell mt-6">
        <CategoryProducts
          loading={loading}
          filteredProducts={filteredProducts}
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
