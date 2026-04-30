import { Loader2, Filter, Pencil, Plus, Search, Trash2, QrCode, X, SlidersHorizontal, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import axiosInstance from '../../api/axiosInstance';
import { BRAND_ICONS, CATEGORY_ICONS, CATEGORIES, BRANDS } from '../../../../../packages/data/categories';
import PrintLabel from '../../components/PrintLabel';
import FilterSelect from '../../components/ui/FilterSelect';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Products = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedQrProduct, setSelectedQrProduct] = useState<any>(null);
  const [loadingQrId, setLoadingQrId] = useState<string | null>(null);

  useEffect(() => {
    if (!showFilters) setIsExpanded(false);
  }, [showFilters]);

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

  const handleShowQr = async (row: any) => {
    try {
      setLoadingQrId(row.id);
      const { data } = await axiosInstance.get(`/products/${row.id}`);
      setSelectedQrProduct(data);
    } catch (err) {
      alert('Failed to load QR code details.');
    } finally {
      setLoadingQrId(null);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/products', {
        params: {
          search: searchTerm,
          category: categoryFilter,
          brand: brandFilter,
          status: statusFilter,
          limit: 100 // Admin needs more visibility
        }
      });
      const mapped = data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        price_per_day: item.price_per_day,
        unique_code: item.unique_code,
        available_quantity: item.available_quantity,
        image: item.images?.[0] ?? null,
        created_at: new Date(item.created_at).toLocaleDateString(),
      }));
      setRows(mapped);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, brandFilter, statusFilter]);

  return (
    <div className="admin-shell space-y-6 py-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Inventory</h1>
          <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
            Manage inventory, pricing, stock, and QR labels.
          </p>
        </div>
        <Link to="/products/add" className="primary-button h-9 px-3 text-xs sm:h-11 sm:px-5 sm:text-sm whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {isLoading && rows.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-card bg-white/50 border border-line">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { label: 'Total Products', value: rows.length, tone: 'bg-sky-50' },
              { label: 'Active Rentals', value: rows.filter(r => r.available_quantity === 0).length, tone: 'bg-amber-50' },
              { label: 'Available in Stock', value: rows.filter(r => r.available_quantity === 1).length, tone: 'bg-emerald-50' },
            ].map((item) => (
              <article key={item.label} className={`flex flex-col items-center justify-between rounded-card border border-white/70 p-3 text-center shadow-card sm:p-4 ${item.tone}`}>
                <p className="flex min-h-[24px] items-center text-[9px] font-bold uppercase tracking-wider text-tertiary sm:text-xs">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-ink sm:mt-2 sm:text-3xl">{item.value}</p>
              </article>
            ))}
          </section>

          <section className="card-surface p-4">
            <div className="flex items-center gap-3 sm:max-w-4xl">
              <label className="input-shell min-h-11 flex-1 sm:max-w-xl">
                <Search className="h-4 w-4 text-muted" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products or codes..."
                  className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-xl border p-1 pr-1 transition-all sm:pr-3 ${showFilters
                  ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500/20'
                  : 'border-line bg-slate-50/50 hover:bg-slate-100'
                  }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm border transition-all ${showFilters
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white text-sky-500 border-line/40'
                  }`}>
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </div>
                <span className={`hidden text-[10px] font-black uppercase tracking-widest sm:inline ${showFilters ? 'text-sky-600' : 'text-tertiary'
                  }`}>
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </span>
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: showFilters ? 'auto' : 0,
                    opacity: showFilters ? 1 : 0
                  }}
                  onAnimationComplete={() => setIsExpanded(showFilters)}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className={isExpanded ? 'relative z-[70]' : 'overflow-hidden relative z-[70]'}
                >
                  <div className="mt-4 flex flex-col md:flex-row md:flex-wrap items-stretch md:items-end gap-3 border-t border-line/50 pt-4 sm:max-w-4xl">
                    <div className="flex flex-col gap-1.5 w-full md:w-44">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary px-1">Category</span>
                      <FilterSelect
                        options={categoryOptions}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 w-full md:w-44">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary px-1">Brand</span>
                      <FilterSelect
                        options={brandOptions}
                        value={brandFilter}
                        onChange={setBrandFilter}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 w-full md:w-44">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary px-1">Availability</span>
                      <FilterSelect
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter('All');
                        setBrandFilter('All');
                        setStatusFilter('all');
                      }}
                      className="h-9 px-4 text-xs font-bold text-muted hover:text-danger transition md:mb-0"
                    >
                      Clear All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Product',
                render: (row) => (
                  <div className="flex items-center gap-2 py-1 max-w-[240px]">
                    <img src={row.image} alt={row.name} className="h-12 w-12 shrink-0 rounded-card object-cover border border-line" />
                    <p className="font-bold text-ink leading-snug line-clamp-2 min-h-[2.5rem]">{row.name}</p>
                  </div>
                ),
              },
              {
                key: 'unique_code',
                label: 'Product Code',
                render: (row) => (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-sm font-bold text-primary"><span className="text-tertiary">ID:</span> {row.unique_code}</span>
                    <button
                      type="button"
                      onClick={() => handleShowQr(row)}
                      disabled={loadingQrId === row.id}
                      className="flex h-7 w-fit items-center justify-center rounded-card border border-line bg-slate-50 px-2 text-xs font-bold text-ink transition hover:bg-sky-500 hover:border-sky-500 hover:text-white disabled:opacity-50"
                      title="Show QR Label"
                    >
                      {loadingQrId === row.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <QrCode className="mr-1 h-3 w-3" />}
                      <span className="ml-1 text-xs">Print QR Label</span>
                    </button>
                  </div>
                ),
              },
              {
                key: 'category_brand',
                label: 'Category',
                render: (row) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 border border-line p-1">
                        {CATEGORY_ICONS[row.category] && <img src={CATEGORY_ICONS[row.category]} alt="" className="h-full w-full object-contain" />}
                      </div>
                      <span className="text-sm font-medium text-ink">{row.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-line p-1">
                        {BRAND_ICONS[row.brand] && <img src={BRAND_ICONS[row.brand]} alt="" className="h-full w-full object-contain" />}
                      </div>
                      <span className="text-sm font-bold text-ink">{row.brand}</span>
                    </div>
                  </div>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${row.available_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${row.available_quantity > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {row.available_quantity > 0 ? 'In Stock' : 'On Rent'}
                  </span>
                ),
              },
              {
                key: 'price_per_day',
                label: 'Price / Day',
                render: (row) => <span className="font-bold text-ink">{formatCurrency(row.price_per_day)}</span>,
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${row.id}/edit`}
                      className="flex h-8 items-center justify-center rounded-card border border-line bg-white px-3 text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5 text-muted transition group-hover:text-white" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                          try {
                            await axiosInstance.delete(`/admin/products/${row.id}`);
                            setRows((current) => current.filter((item) => item.id !== row.id));
                          } catch (err) {
                            alert('Failed to delete product.');
                          }
                        }
                      }}
                      className="flex h-8 items-center justify-center rounded-card border border-danger/20 bg-danger/5 px-3 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                ),
              },
            ]}
            rows={rows}
            renderMobileCard={(row) => (
              <article key={row.id} className="card-surface p-4 flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 border border-line rounded-card overflow-hidden bg-slate-50">
                    <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col py-0.5">
                    <div className="flex flex-col gap-1.5">
                      <span className={`w-fit inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${row.available_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {row.available_quantity > 0 ? 'Stock' : 'Rent'}
                      </span>
                      <h3 className="text-base font-bold text-ink leading-tight line-clamp-2 min-h-[2.5rem]">{row.name}</h3>
                    </div>

                    <div className="mt-1.5 flex items-center">
                      <span className="inline-flex items-center rounded border border-line bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                        <span className="mr-1 text-[9px] font-black uppercase text-tertiary/70">ID:</span>
                        {row.unique_code}
                      </span>
                    </div>

                    <div className="mt-auto pt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-50 border border-line p-0.5">
                            {CATEGORY_ICONS[row.category] && <img src={CATEGORY_ICONS[row.category]} alt="" className="h-full w-full object-contain" />}
                          </div>
                          <span className="text-[11px] font-medium text-muted truncate">{row.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white border border-line p-0.5">
                            {BRAND_ICONS[row.brand] && <img src={BRAND_ICONS[row.brand]} alt="" className="h-full w-full object-contain" />}
                          </div>
                          <span className="text-[11px] font-bold text-ink truncate">{row.brand}</span>
                        </div>
                      </div>

                      <p className="text-base font-black text-ink">
                        {formatCurrency(row.price_per_day)} <span className="text-[10px] font-medium text-muted lowercase">/ day</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => handleShowQr(row)}
                    disabled={loadingQrId === row.id}
                    className="flex h-10 w-full items-center justify-center rounded-card border border-line bg-slate-50 text-sm font-bold text-ink transition hover:bg-sky-500 hover:border-sky-500 hover:text-white disabled:opacity-50"
                  >
                    {loadingQrId === row.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />} Print QR Label
                  </button>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${row.id}/edit`}
                      className="flex h-10 flex-1 items-center justify-center rounded-card border border-line bg-white text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
                    >
                      <Pencil className="mr-2 h-4 w-4 text-muted transition group-hover:text-white" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                          try {
                            await axiosInstance.delete(`/admin/products/${row.id}`);
                            setRows((current) => current.filter((item) => item.id !== row.id));
                          } catch (err) {
                            alert('Failed to delete product.');
                          }
                        }
                      }}
                      className="flex h-10 flex-1 items-center justify-center rounded-card border border-danger/20 bg-danger/5 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            )}
          />
        </div>
      )}

      {selectedQrProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-card bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelectedQrProduct(null)}
              className="absolute right-4 top-4 text-muted transition hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-6 text-xl font-bold text-ink">Product Label Preview</h2>
            <PrintLabel product={selectedQrProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
