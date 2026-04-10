import SearchBar from '../../components/ui/SearchBar';
import CategoryChips from '../../components/CategoryChips';
import { Categories as categories } from '../../data/categories';

interface CategoryHeaderProps {
  pullDistance: number;
  search: string;
  setSearch: (val: string) => void;
  setShowFilters: (val: boolean) => void;
  activeCategory: string;
  setParams: (params: any) => void;
}

const CategoryHeader = ({ pullDistance, search, setSearch, setShowFilters, activeCategory, setParams }: CategoryHeaderProps) => {
  return (
    <div className="sticky top-20 z-30 space-y-4 bg-page/90 pb-2 backdrop-blur md:top-24">
      <div className="mx-auto h-1.5 w-16 rounded-full bg-primary/20" style={{ transform: `scaleX(${Math.max(pullDistance / 100, 0.2)})` }} />
      <SearchBar value={search} onChange={setSearch} onFilterClick={() => setShowFilters(true)} />
      <div className="hidden md:block">
        <CategoryChips categories={categories} activeCategory={activeCategory} onSelect={(category) => setParams(category === 'All' ? {} : { category })} />
      </div>
    </div>
  );
};

export default CategoryHeader;
