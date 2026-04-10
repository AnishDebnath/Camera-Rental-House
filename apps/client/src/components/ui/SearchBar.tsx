import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ value, onChange, onFilterClick }) => (
  <div className="flex items-center gap-3">
    <div className="input-shell flex-1">
      <Search className="h-4 w-4 text-tertiary" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search cameras, lenses, lights..."
        className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
      />
    </div>
    <button type="button" onClick={onFilterClick} className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white">
      <SlidersHorizontal className="h-5 w-5" />
    </button>
  </div>
);

export default SearchBar;
