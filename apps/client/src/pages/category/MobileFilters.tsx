import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import CategoryChips from '../../components/CategoryChips';
import { Categories as categories } from '../../data/categories';

interface MobileFiltersProps {
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  activeCategory: string;
  setParams: (params: any) => void;
}

const MobileFilters = ({ showFilters, setShowFilters, activeCategory, setParams }: MobileFiltersProps) => {
  return (
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
  );
};

export default MobileFilters;
