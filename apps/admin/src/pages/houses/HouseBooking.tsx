import { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Search,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Info,
  ArrowLeft,
  Store,
  UserPlus,
  ShoppingCart,
  Phone,
  Loader2,
  ShieldCheck,
  SlidersHorizontal,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminProducts } from '../../data/mockAdmin';
import { BRAND_ICONS, CATEGORY_ICONS, CATEGORIES, BRANDS } from '../../../../../packages/data/categories';
import { mockHouses } from './index';
import { useToast } from '@camera-rental-house/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterSelect from '../../components/ui/FilterSelect';
import ProductInventoryFilters from '../../components/ui/ProductInventoryFilters';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const HouseBooking = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get('houseId');

  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryOptions = [
    { label: 'All Categories', value: 'All' },
    ...CATEGORIES.filter(c => c !== 'All').map(c => ({
      label: c,
      value: c,
      image: CATEGORY_ICONS[c]
    }))
  ];

  const brandOptions = [
    { label: 'All Brands', value: 'All' },
    ...BRANDS.filter(b => b !== 'All').map(b => ({
      label: b,
      value: b,
      image: BRAND_ICONS[b]
    }))
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    {
      label: 'In Stock',
      value: 'in_stock',
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" />
    },
    {
      label: 'On Rent',
      value: 'on_rent',
      icon: <Clock className="h-3 w-3 text-amber-500" />
    }
  ];

  useEffect(() => {
    if (houseId) {
      const house = mockHouses.find(h => h.id === houseId);
      if (house) setSelectedHouse(house);
    }
  }, [houseId]);

  const filteredProducts = useMemo(() => {
    return adminProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.unique_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;

      // Handle "in_stock" vs "Available" and "on_rent" vs "Rented"
      const productStatus = p.status?.toLowerCase() || '';
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'in_stock' && (productStatus === 'in_stock' || productStatus === 'available')) ||
        (statusFilter === 'on_rent' && (productStatus === 'on_rent' || productStatus === 'rented'));

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [searchTerm, categoryFilter, brandFilter, statusFilter]);

  const addToCart = (product: any) => {
    if (cart.find(item => item.id === product.id)) {
      addToast({ title: 'Already in cart', message: 'Item already added.', tone: 'warning' });
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleProcessBooking = () => {
    if (!selectedHouse || cart.length === 0) {
      addToast({ title: 'Incomplete Details', message: 'Select partner and gear.', tone: 'error' });
      return;
    }
    addToast({
      title: 'Order Generated',
      message: `Rental order for ${selectedHouse.name} is ready for collection.`,
      tone: 'success'
    });
    navigate('/rentals');
  };

  return (
    <div className="admin-shell space-y-6 py-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => navigate('/houses')}
        className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Houses
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section 1: Partner Details */}
          <section>
            <AnimatePresence mode="wait">
              {!selectedHouse ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {mockHouses.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHouse(h)}
                      className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 text-left hover:border-primary/30 hover:bg-slate-50 transition-all group shadow-sm"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-line group-hover:bg-white group-hover:scale-105 transition-all duration-300">
                        <Building2 className="h-6 w-6 text-muted group-hover:text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-ink leading-tight truncate">{h.name}</p>
                        <p className="text-[10px] font-bold text-muted uppercase mt-1 tracking-wider">{h.ownerName}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-surface p-6 overflow-hidden relative"
                >
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
                    <div className="flex items-center gap-5">
                      <div className="relative h-16 w-16 shrink-0">
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-sm border border-indigo-100/50">
                          <Building2 className="h-8 w-8" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-sm ${selectedHouse.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                          {selectedHouse.status === 'Active' ? <ShieldCheck className="h-3 w-3 text-white" /> : <Loader2 className="h-3 w-3 text-white animate-spin" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-black text-ink tracking-tight">{selectedHouse.name}</h3>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-muted">
                          <div className="flex items-center gap-1.5">
                            <Store className="h-3.5 w-3.5 text-primary/60" />
                            <span>{selectedHouse.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-sky-500/60" />
                            <span>{selectedHouse.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!houseId && (
                      <button
                        onClick={() => setSelectedHouse(null)}
                        className="secondary-button h-9 px-4 text-xs font-black uppercase tracking-widest flex items-center justify-center"
                      >
                        Change Partner
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Section 2: Equipment Selection (Unified Card) */}
          <section className="card-surface p-6 space-y-6">
            <div className="flex items-center gap-3 pb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 border border-sky-100/50 shadow-sm">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-ink tracking-tight">Select Gear</h2>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Browse & Add Equipment</p>
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
        </div>

        {/* Right Column: Order Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <section className="card-surface p-6 shadow-xl border-primary/5">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-black uppercase tracking-widest text-ink leading-none">Your Cart</h2>
                  </div>
                </div>
                {cart.length > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/20">
                    {cart.length}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-muted/50">
                    <Package className="h-8 w-8" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No gear selected</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2.5">
                    <AnimatePresence>
                      {cart.map(item => (
                        <motion.div
                          layout
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-line hover:border-primary/20 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                              <img src={item.image} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black truncate max-w-[130px] leading-tight text-ink">{item.name}</p>
                              <p className="text-[9px] text-muted uppercase font-black tracking-widest mt-1.5">{item.unique_code}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted/40 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-2xl border border-line p-5 space-y-4 bg-slate-50/50 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Items for Handover</span>
                      <span className="text-lg font-black text-ink">{cart.length}</span>
                    </div>
                    <div className="pt-4 border-t border-line flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Status</span>
                      <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-amber-600 border border-amber-100">
                        <Clock className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProcessBooking}
                    className="w-full primary-button h-14 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                  >
                    Confirm Booking
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </section>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-surface p-5 bg-blue-50/30 border-blue-100 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 border border-white shadow-sm">
                  <Info className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Collection Policy</h3>
                  <p className="text-[10px] leading-relaxed text-blue-800/80 font-bold">
                    ID verification and photo proof are mandatory during release. Rep name must be recorded.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default HouseBooking;
