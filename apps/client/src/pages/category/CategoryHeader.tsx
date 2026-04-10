import { useState, useEffect, useRef } from 'react';
import SearchBar from '../../components/ui/SearchBar';
import clsx from 'clsx';

interface CategoryHeaderProps {
  pullDistance: number;
  search: string;
  setSearch: (val: string) => void;
  setShowFilters: (val: boolean) => void;
}

const CategoryHeader = ({ search, setSearch, setShowFilters }: CategoryHeaderProps) => {
  const [isFixed, setIsFixed] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

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
            : 'relative bg-transparent'
        )}
      >
        {/* Liquid glass gradient overlay — same as Navbar */}
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none transition-opacity duration-500',
            isFixed ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div className="relative app-shell">
          <SearchBar value={search} onChange={setSearch} onFilterClick={() => setShowFilters(true)} />
        </div>
      </div>
    </>
  );
};

export default CategoryHeader;

