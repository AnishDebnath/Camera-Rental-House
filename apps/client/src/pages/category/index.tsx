import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryHeader from './CategoryHeader';
import CategoryProducts from './CategoryProducts';
import MobileFilters from './MobileFilters';
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
  }, [activeCategory]);

  const filteredProducts = useMemo(
    () =>
      mockProducts.filter((product) => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [activeCategory, debouncedSearch],
  );

  return (
    <div className="page-animate app-shell space-y-6">
      <CategoryHeader
        pullDistance={pullDistance}
        search={search}
        setSearch={setSearch}
        setShowFilters={setShowFilters}
        activeCategory={activeCategory}
        setParams={setParams}
      />
      <CategoryProducts
        loading={loading}
        filteredProducts={filteredProducts}
        itemsToShow={itemsToShow}
        setItemsToShow={setItemsToShow}
      />
      <MobileFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeCategory={activeCategory}
        setParams={setParams}
      />
    </div>
  );
};

export default Category;
