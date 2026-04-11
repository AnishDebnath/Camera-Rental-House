import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import FilterChips from './FilterChips';
import { useLenis } from '../../context/LenisContext';

interface MobileFiltersProps {
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  activeCategory: string;
  setParams: (params: any) => void;
}

const MobileFilters = ({ showFilters, setShowFilters, activeCategory, setParams }: MobileFiltersProps) => {
  const lenis = useLenis();

  // Lock scroll (Lenis + native) when mobile filter sheet is open
  useEffect(() => {
    if (showFilters) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [showFilters, lenis]);

  return (
    <Dialog open={showFilters} onClose={setShowFilters} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 rounded-t-[28px] bg-white p-6 shadow-2xl lg:hidden">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-ink">Filter Gears</p>
            <p className="text-sm text-muted">Choose the category or brand you need.</p>
          </div>
          <button type="button" onClick={() => setShowFilters(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-page">
            <X className="h-5 w-5" />
          </button>
        </div>
        <FilterChips
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
