import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { SearchX, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import CategoryChips from '../components/CategoryChips';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { categories, mockProducts } from '../data/mockProducts';
import useDebounce from '../hooks/useDebounce';
import usePullToRefresh from '../hooks/usePullToRefresh';

const Browse = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8);
  const activeCategory = params.get('category') || 'All';
  const debouncedSearch = useDebounce(search, 250);

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
      <div className="sticky top-20 z-30 space-y-4 bg-page/90 pb-2 backdrop-blur md:top-24">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-primary/20" style={{ transform: `scaleX(${Math.max(pullDistance / 100, 0.2)})` }} />
        <SearchBar value={search} onChange={setSearch} onFilterClick={() => setShowFilters(true)} />
        <div className="hidden md:block">
          <CategoryChips categories={categories} activeCategory={activeCategory} onSelect={(category) => setParams(category === 'All' ? {} : { category })} />
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Browse Gear</h1>
            <p className="text-sm text-muted">Curated inventory for production days.</p>
          </div>
          <p className="rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
            {filteredProducts.length} items
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : filteredProducts.length ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {filteredProducts.slice(0, itemsToShow).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {itemsToShow < filteredProducts.length ? (
              <button type="button" onClick={() => setItemsToShow((current) => current + 4)} className="secondary-button mx-auto">
                Load More
              </button>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="No gear found"
            message="Try a different search or clear your filters to see more equipment."
            actionLabel="Clear Filters"
            actionTo="/browse"
            icon={<SearchX className="h-8 w-8" />}
          />
        )}
      </section>

      <Dialog open={showFilters} onClose={setShowFilters} className="relative z-50 md:hidden">
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" />
        <div className="fixed inset-x-0 bottom-0 rounded-t-[28px] bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-ink">Filter by category</p>
              <p className="text-sm text-muted">Choose the gear lane you need.</p>
            </div>
            <button type="button" onClick={() => setShowFilters(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-page">
              <X className="h-5 w-5" />
            </button>
          </div>
          <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onSelect={(category) => {
              setParams(category === 'All' ? {} : { category });
              setShowFilters(false);
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Browse;
