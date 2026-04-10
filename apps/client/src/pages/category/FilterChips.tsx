import clsx from 'clsx';
import { CategoriesList, BrandsList } from '../../data/categories';

interface FilterChipsProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

const FilterChips = ({ activeCategory, onSelect }: FilterChipsProps) => (
  <div className="space-y-6">
    {/* Categories Roll */}
    <div className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted/80 pl-1">Categories</p>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => onSelect('All')}
          className={clsx(
            'flex flex-col items-center justify-center min-w-[76px] h-[86px] rounded-[20px] transition-all flex-shrink-0',
            activeCategory === 'All'
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
              : 'border border-white/60 bg-white/40 text-ink hover:bg-white/60 hover:border-primary/30'
          )}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider">All Gear</span>
        </button>
        {CategoriesList.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => onSelect(item.category)}
            className={clsx(
              'group flex flex-col items-center justify-between min-w-[86px] h-[86px] rounded-[20px] p-2 transition-all flex-shrink-0',
              activeCategory === item.category
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                : 'border border-white/60 bg-white/40 text-ink hover:bg-white/60 hover:border-primary/30'
            )}
          >
            <div className="h-12 w-12 flex items-center justify-center p-1">
              <img 
                src={item.image} 
                alt={item.category} 
                className={clsx(
                  "object-contain max-h-full max-w-full drop-shadow-sm transition-transform group-hover:scale-110",
                  activeCategory === item.category ? "" : "mix-blend-multiply"
                )} 
              />
            </div>
            <span className="text-[11px] font-semibold tracking-wide">{item.category}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Brands Roll */}
    <div className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted/80 pl-1">Top Brands</p>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-4">
        {BrandsList.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => onSelect(item.category)}
            className={clsx(
              'group flex flex-col items-center justify-between min-w-[86px] h-[86px] rounded-[20px] p-2 transition-all flex-shrink-0',
              activeCategory === item.category
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                : 'border border-white/60 bg-white/40 text-ink hover:bg-white/60 hover:border-primary/30'
            )}
          >
            <div className="h-10 w-10 flex items-center justify-center mt-1">
              <img 
                src={item.image} 
                alt={item.category} 
                className={clsx(
                  "object-contain max-h-full max-w-full drop-shadow-sm transition-transform group-hover:scale-110",
                  activeCategory === item.category && item.category !== 'Sony' ? 'brightness-0 invert' : ''
                )} 
              />
            </div>
            <span className="text-[11px] font-semibold tracking-wide">{item.category}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default FilterChips;
