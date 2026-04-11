import { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
    <Transition.Root show={showFilters} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setShowFilters}>
        {/* Backdrop Animation */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-full">
              {/* Sheet Animation */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-500"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in duration-300"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto w-full max-w-full">
                  <div className="rounded-t-[28px] bg-white p-6 shadow-2xl ring-1 ring-black/5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-ink">Filter Gears</p>
                        <p className="text-sm text-muted">Choose the category or brand you need.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setShowFilters(false)} 
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-page active:scale-95 transition-transform"
                      >
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileFilters;
