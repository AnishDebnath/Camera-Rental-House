import { Search, SlidersHorizontal } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

const SearchBar = ({ value, onChange, onFilterClick }) => {
  const placeholderText = useTypewriter();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center relative group">
        <div className="absolute left-4 z-10">
          <Search className="h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors" />
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholderText}
          className="w-full h-12 pl-12 pr-4 rounded-2xl border border-white/60 bg-white/40 ring-1 ring-black/[0.03] backdrop-blur-md text-sm font-medium transition-all focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 hover:border-primary/20 outline-none truncate placeholder:text-muted/60"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-white/40 active:scale-95"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchBar;
