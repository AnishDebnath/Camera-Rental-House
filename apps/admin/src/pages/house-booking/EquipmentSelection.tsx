import { Package, Plus, Filter, Check } from 'lucide-react';
import ProductInventoryFilters from '../../components/ui/ProductInventoryFilters';
import { BRAND_ICONS, CATEGORY_ICONS } from '../../../../../packages/data/categories';

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
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
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
  cart,
  addToCart,
  removeFromCart
}: EquipmentSelectionProps) => {
  return (
    <section className="card-surface p-6 space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 border border-sky-100/50 shadow-sm">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-ink leading-none">Select Products</h2>
          <p className="text-[10px] font-bold text-muted uppercase mt-1.5">Browse & Add Equipment</p>
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

      <div className="border-t border-line/50 pt-6">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <Filter className="h-10 w-10 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No products match filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredProducts.map(product => {
              const isInCart = cart.some(item => item.id === product.id);
              
              return (
                <div key={product.id} className="group relative flex flex-col rounded-2xl border border-line bg-white transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
                  <div className="flex gap-4 p-4">
                    {/* Image Section */}
                    <div className="relative h-20 w-20 shrink-0">
                      <div className="h-full w-full overflow-hidden rounded-xl border border-line bg-slate-50">
                        <img src={product.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-sm font-black text-ink line-clamp-2 tracking-tight min-h-[2.5rem]">{product.name}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          ID: {product.unique_code}
                        </span>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest ${product.available_quantity > 0 ? 'bg-success/10 text-emerald-700' : 'bg-warning/10 text-amber-600'
                          }`}>
                          {product.available_quantity > 0 ? 'In Stock' : 'On Rent'}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-50 border border-line p-0.5">
                            {CATEGORY_ICONS[product.category] && <img src={CATEGORY_ICONS[product.category]} alt="" className="h-full w-full object-contain" />}
                          </div>
                          <span className="text-[11px] font-medium text-muted truncate">{product.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white border border-line p-0.5">
                            {BRAND_ICONS[product.brand] && <img src={BRAND_ICONS[product.brand]} alt="" className="h-full w-full object-contain" />}
                          </div>
                          <span className="text-[11px] font-bold text-ink truncate">{product.brand}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-4 h-[1px] bg-line/50" />

                  {/* Footer Section */}
                  <div className="mt-auto p-4 pt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-muted uppercase tracking-widest">Price per day</span>
                      <p className="text-sm font-black text-primary">₹{product.price_per_day}</p>
                    </div>
                    <button
                      onClick={() => isInCart ? removeFromCart(product.id) : addToCart(product)}
                      disabled={product.available_quantity === 0 && !isInCart}
                      className={`group/btn flex h-8 px-3 items-center gap-1.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${
                        isInCart 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105'
                      } text-[10px] font-black uppercase tracking-widest`}
                    >
                      {isInCart ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 transition-transform group-hover/btn:rotate-90" />
                      )}
                      <span>{isInCart ? 'Added in Cart' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
