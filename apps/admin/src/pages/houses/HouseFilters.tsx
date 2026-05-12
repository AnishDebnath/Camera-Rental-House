import { Search } from 'lucide-react';

type HouseFiltersProps = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
};

const HouseFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: HouseFiltersProps) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center">
    <div className="flex flex-1 items-center gap-3 rounded-card border border-line bg-white px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
      <Search className="h-5 w-5 text-muted" />
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search partners..." 
        className="flex-1 border-none bg-transparent p-0 text-sm font-medium focus:ring-0"
      />
    </div>
    <select 
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="rounded-card border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink focus:ring-2 focus:ring-primary/20 outline-none"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="pending">Pending</option>
    </select>
  </div>
);

export default HouseFilters;
