import { Loader2, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import axiosInstance from '../../api/axiosInstance';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Products = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products');
        const mapped = data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          price_per_day: item.price_per_day,
          unique_code: item.unique_code,
          image: item.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
          created_at: new Date(item.created_at).toLocaleDateString(),
        }));
        setRows(mapped);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 to-slate-200">
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

        {isLoading ? (
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
                    placeholder="Search products or codes..."
                    className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
                  />
                </label>
                <button type="button" className="secondary-button">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </button>
              </div>
            </section>

            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Product',
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <img src={row.image} alt={row.name} className="h-12 w-12 rounded-card object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{(row as any).brand || 'Gear'}</span>
                          <p className="font-bold text-ink">{row.name}</p>
                        </div>
                        <p className="text-xs font-mono font-bold text-tertiary">{row.unique_code}</p>
                      </div>
                    </div>
                  ),
                },
                { key: 'category', label: 'Category' },
                {
                  key: 'price_per_day',
                  label: 'Price / day',
                  render: (row) => <span className="font-bold text-ink">{formatCurrency(row.price_per_day)}</span>,
                },
                { key: 'created_at', label: 'Created' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${row.id}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:bg-primary hover:text-white"
                        aria-label={`Edit ${row.name}`}
                      >
                        <Pencil className="h-4 w-4" />
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-danger/20 bg-danger/5 text-danger transition hover:bg-danger hover:text-white"
                        aria-label={`Delete ${row.name}`}
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
          </ div>
        )}
      </div>
    </div>
  );
};

export default Products;
