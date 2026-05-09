import { Search } from 'lucide-react';

type UserFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const UserFilters = ({ searchTerm, setSearchTerm }: UserFiltersProps) => (
  <section className="card-surface p-4">
    <label className="input-shell min-h-11 md:max-w-lg">
      <Search className="h-4 w-4 text-muted" />
      <input
        type="search"
        placeholder="Search customer name, phone, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
      />
    </label>
  </section>
);

export default UserFilters;
