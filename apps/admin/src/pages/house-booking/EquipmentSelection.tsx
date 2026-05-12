import { Package, Plus, Filter } from 'lucide-react';
import ProductInventoryFilters from '../../components/ui/ProductInventoryFilters';

interface EquipmentSelectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryOptions: any[];
  brandOptions: any[];
  statusOptions: any[];
  filteredProducts: any[];
  addToCart: (product: any) => void;
}

export const EquipmentSelection = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  statusFilter,
  setStatusFilter,
  categoryOptions,
  brandOptions,
  statusOptions,
  filteredProducts,
  addToCart
}: EquipmentSelectionProps) => {
  return (
    <section className="card-surface p-6 space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 border border-sky-100/50 shadow-sm">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black uppercase tracking-widest text-ink leading-none">Select Gear</h2>
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-1.5">Browse & Add Equipment</p>
        </div>
      </div>

      <ProductInventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
        statusOptions={statusOptions}
        className="shadow-none border-0 bg-transparent p-0"
      />

      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar border-t border-line/50 pt-6">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <Filter className="h-10 w-10 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No products match filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredProducts.map(product => (
              <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-line p-3 hover:border-primary/20 hover:bg-slate-50/50 transition-all bg-white group shadow-sm">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line shadow-sm relative">
                  <img src={product.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-ink leading-tight">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] font-black text-muted/60 uppercase tracking-widest">{product.unique_code}</p>
                    <span className={`h-1.5 w-1.5 rounded-full ${product.status === 'in_stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-ink hover:bg-primary hover:text-white transition-all active:scale-90 shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
