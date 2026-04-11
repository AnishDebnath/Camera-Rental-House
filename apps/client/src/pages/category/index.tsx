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
        const matchesFilter = activeCategory === 'All' || product.category === activeCategory || product.name.toLowerCase().includes(activeCategory.toLowerCase());
        const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [activeCategory, debouncedSearch],
  );

  return (
    <div className="min-h-screen">
      <CategoryHeader
        pullDistance={pullDistance}
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeCategory={activeCategory}
        onSelectCategory={(category) => {
          setParams(category === 'All' ? {} : { category });
        }}
      />
      <div className="app-shell mt-6">
        <CategoryProducts
          loading={loading}
          filteredProducts={filteredProducts}
          itemsToShow={itemsToShow}
          setItemsToShow={setItemsToShow}
        />
      </div>
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
