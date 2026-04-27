import { Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { adminProducts } from '../../data/mockAdmin';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Products = () => {
  const [rows, setRows] = useState(adminProducts);

  return (
    <div className="admin-shell space-y-5 py-6">
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

      <section className="grid gap-3 md:grid-cols-3">
        {[
          { label: 'Available Units', value: '42', tone: 'bg-sky-50' },
          { label: 'Low Stock', value: '6', tone: 'bg-amber-50' },
          { label: 'Categories', value: '7', tone: 'bg-emerald-50' },
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
                  <p className="font-bold text-ink">{row.name}</p>
                  <p className="text-xs font-medium text-tertiary">{row.unique_code}</p>
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
          {
            key: 'quantity',
            label: 'Qty',
            render: (row) => (
              <span className="rounded-pill bg-primary-light px-3 py-1 text-xs font-bold text-ink">{row.quantity}</span>
            ),
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
                  onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
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
    </div>
  );
};

export default Products;
