import { useState, useEffect, useRef } from 'react';
import SearchBar from '../../components/ui/SearchBar';
import { X } from 'lucide-react';
import clsx from 'clsx';
import FilterChips from './FilterChips';
import { useLenis } from '../../context/LenisContext';

interface CategoryHeaderProps {
  pullDistance: number;
  search: string;
  setSearch: (val: string) => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryHeader = ({ 
  search, 
  setSearch, 
  showFilters, 
  setShowFilters, 
  activeCategory, 
  onSelectCategory 
}: CategoryHeaderProps) => {
  const [isFixed, setIsFixed] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Measure bar height for the placeholder
  useEffect(() => {
    if (barRef.current) {
      setBarHeight(barRef.current.offsetHeight);
    }
  }, []);

  // IntersectionObserver works with Lenis, native scroll, anything —
  // it fires whenever the sentinel element enters/exits the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting (scrolled above viewport), fix the bar
        setIsFixed(!entry.isIntersecting);
      },
      {
        root: null,       // viewport
        threshold: 0,     // trigger the moment any part leaves
        rootMargin: '0px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const lenis = useLenis();

  // Lock/unlock Lenis scroll when desktop filter opens/closes
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;
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

  // Close filter on click outside
  useEffect(() => {
    if (!showFilters) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showFilters, setShowFilters]);

  return (
    <>
      {/* Sentinel: sits exactly where the search bar should begin */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 0 }} />

      {/* Placeholder holds layout height when the bar is lifted to fixed */}
      {isFixed && <div style={{ height: barHeight }} aria-hidden="true" />}

      {/* Search bar — switches between relative and fixed */}
      <div
        ref={barRef}
        className={clsx(
          'w-full z-[200] transition-all duration-500',
          isFixed
            ? 'fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-[40px] border-b border-white/60 shadow-[0_10px_40px_rgba(31,_38,_135,_0.05)] py-3'
            : 'relative bg-transparent pb-3'
        )}
      >
        {/* Liquid glass gradient overlay — same as Navbar */}
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none transition-opacity duration-500',
            isFixed ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Visual-only backdrop — pointer-events-none so scroll is never blocked */}
        <div 
          className={clsx(
            "hidden lg:block fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 pointer-events-none",
            showFilters ? "opacity-100" : "opacity-0"
          )}
        />

        <div ref={filterPanelRef} className="relative app-shell">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            onFilterClick={() => setShowFilters(!showFilters)} 
          />

          {/* Desktop Filters Overlay */}
          <div className={clsx(
            "hidden lg:block absolute top-full left-4 md:left-6 lg:left-8 right-4 md:right-6 lg:right-8 z-[201] transition-all duration-500 ease-out",
            showFilters ? "translate-y-4 opacity-100" : "translate-y-0 opacity-0 pointer-events-none"
          )}>
            <div className="p-8 rounded-[32px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
               <div className="relative">
                 <div className="mb-6 flex justify-between items-start">
                    <div>
                       <h3 className="text-lg font-semibold text-ink">Filter Gears</h3>
                       <p className="text-sm text-muted">Choose the category or brand you need to refine your search.</p>
                    </div>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-page hover:bg-slate-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                 </div>
                 <FilterChips 
                    activeCategory={activeCategory} 
                    onSelect={onSelectCategory}
                    isDark={false}
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryHeader;

