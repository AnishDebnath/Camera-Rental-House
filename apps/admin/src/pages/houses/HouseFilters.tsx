import { Search, Building2, CheckCircle, Clock } from 'lucide-react';
import FilterSelect from '../../components/ui/FilterSelect';

type HouseFiltersProps = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
};

const STATUS_OPTIONS = [
  { label: 'All Houses', value: 'all', icon: <Building2 className="h-3.5 w-3.5" /> },
  { label: 'Active', value: 'active', icon: <CheckCircle className="h-3.5 w-3.5 text-success" /> },
  { label: 'Pending', value: 'pending', icon: <Clock className="h-3.5 w-3.5 text-warning" /> },
];

const HouseFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: HouseFiltersProps) => (
  <section className="card-surface p-4 flex flex-col md:flex-row items-stretch gap-4">
    <label className="input-shell flex-1 min-h-11 md:max-w-lg">
      <Search className="h-4 w-4 text-muted" />
      <input 
        type="search" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search partners, contact person..." 
        className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
      />
    </label>

    <div className="md:w-[240px]">
      <FilterSelect 
        options={STATUS_OPTIONS}
        value={statusFilter}
        onChange={setStatusFilter}
        placeholder="Filter Status"
      />
    </div>
  </section>
);

export default HouseFilters;
