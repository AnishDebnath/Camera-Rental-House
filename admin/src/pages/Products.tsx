import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { adminProducts } from '../data/mockAdmin';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Products = () => {
  const [rows, setRows] = useState(adminProducts);

  return (
    <div className="admin-shell space-y-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Products</h1>
          <p className="text-sm text-muted">Manage inventory, pricing, and quantity.</p>
        </div>
        <Link to="/admin/products/add" className="primary-button">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'Product',
            render: (row) => (
              <div className="flex items-center gap-3">
                <img src={row.image} alt={row.name} className="h-12 w-12 rounded-2xl object-cover" />
                <div>
                  <p className="font-semibold text-ink">{row.name}</p>
                  <p className="text-xs text-tertiary">{row.unique_code}</p>
                </div>
              </div>
            ),
          },
          { key: 'category', label: 'Category' },
          {
            key: 'price_per_day',
            label: 'Price / day',
            render: (row) => <span className="font-semibold text-primary">{formatCurrency(row.price_per_day)}</span>,
          },
          { key: 'quantity', label: 'Qty' },
          { key: 'created_at', label: 'Created' },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex items-center gap-2">
                <Link to={`/admin/products/${row.id}/edit`} className="secondary-button">
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                  className="pill-button border border-danger/20 bg-danger/5 px-4 text-danger"
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
              <img src={row.image} alt={row.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{row.name}</p>
                <p className="text-xs text-muted">{row.category}</p>
                <p className="mt-2 text-sm font-bold text-primary">{formatCurrency(row.price_per_day)}</p>
              </div>
            </div>
          </article>
        )}
      />
    </div>
  );
};

export default Products;
