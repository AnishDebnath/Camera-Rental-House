import { Loader2, Filter, Pencil, Plus, Search, Trash2, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import axiosInstance from '../../api/axiosInstance';
import { BRAND_ICONS, CATEGORY_ICONS } from '../../../../../packages/data/categories';

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

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/products', {
        params: {
          search: searchTerm,
          category: categoryFilter,
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
  }, [searchTerm, categoryFilter]);

  return (
    <div className="admin-shell space-y-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">Products</h1>
            <p className="mt-2 text-sm font-medium text-muted">Manage inventory, pricing, stock, and QR labels.</p>
          </div>
          <Link to="/products/add" className="primary-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>

        {isLoading && rows.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-card bg-white/50 border border-line">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <section className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Total Inventory', value: rows.length, tone: 'bg-sky-50' },
                { label: 'Categories', value: new Set(rows.map(r => r.category)).size, tone: 'bg-emerald-50' },
                { label: 'Recent Additions', value: rows.filter(r => new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, tone: 'bg-amber-50' },
              ].map((item) => (
                <article key={item.label} className={`rounded-card border border-white/70 p-4 shadow-card ${item.tone}`}>
                  <p className="text-sm font-bold text-ink">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold text-ink">{item.value}</p>
                </article>
              ))}
            </section>

            <section className="card-surface p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="input-shell min-h-11 flex-1 md:max-w-md">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products or codes..."
                    className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
                  />
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="secondary-button h-[42px] py-0 text-sm"
                >
                  <option value="All">All Categories</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Lenses">Lenses</option>
                  <option value="Lights">Lights</option>
                  <option value="Audio">Audio</option>
                  <option value="Tripods">Tripods</option>
                </select>
              </div>
            </section>

            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Product',
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <img src={row.image} alt={row.name} className="h-12 w-12 rounded-card object-cover border border-line" />
                      <div>
                        <p className="font-bold text-ink">{row.name}</p>
                        <p className="text-xs font-mono font-bold text-tertiary">{row.unique_code}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'category',
                  label: 'Category',
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 border border-line p-0.5">
                        {CATEGORY_ICONS[row.category] && <img src={CATEGORY_ICONS[row.category]} alt="" className="h-full w-full object-contain" />}
                      </div>
                      <span className="text-xs font-medium text-ink">{row.category}</span>
                    </div>
                  )
                },
                {
                  key: 'brand',
                  label: 'Brand',
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-line p-0.5">
                        {BRAND_ICONS[row.brand] && <img src={BRAND_ICONS[row.brand]} alt="" className="h-full w-full object-contain" />}
                      </div>
                      <span className="text-xs font-bold text-ink">{row.brand}</span>
                    </div>
                  )
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:bg-primary hover:text-white"
                        title="Edit Product"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => window.open(`${axiosInstance.defaults.baseURL}/products/${row.id}/label`, '_blank')}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:bg-sky-500 hover:text-white"
                        title="Print QR Label"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-danger/20 bg-danger/5 text-danger transition hover:bg-danger hover:text-white"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={rows}
              renderMobileCard={(row) => (
                <article key={row.id} className="card-surface p-4">
                  <div className="flex gap-4">
                    <img src={row.image} alt={row.name} className="h-20 w-20 rounded-card object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{row.name}</p>
                      <p className="text-xs font-medium text-muted">{row.category}</p>
                      <p className="mt-2 text-sm font-bold text-ink">{formatCurrency(row.price_per_day)}</p>
                    </div>
                  </div>
                </article>
              )}
            />
          </div>
        )}
      </div>
  );
};

export default Products;
