import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminProducts } from '../data/mockAdmin';

const EditProduct = () => {
  const { id } = useParams();
  const product = useMemo(() => adminProducts.find((item) => item.id === id) || adminProducts[0], [id]);
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: product.description || '',
    pricePerDay: String(product.price_per_day),
    quantity: String(product.quantity),
  });

  return (
    <div className="admin-shell space-y-5 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Edit Product</h1>
        <p className="mt-2 text-sm font-medium text-muted">Update inventory, pricing, and image set.</p>
      </div>

      <form className="card-surface space-y-5 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-4 rounded-card bg-white/60 p-4">
          <img src={product.image} alt={product.name} className="h-24 w-24 rounded-card object-cover" />
          <div>
            <p className="text-sm font-bold text-ink">{product.name}</p>
            <p className="mt-1 text-xs font-medium text-muted">{product.unique_code}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">General Info</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Product Name</span>
              <div className="input-shell">
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Category</span>
              <div className="input-shell">
                <input
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Description</span>
              <div className="input-shell h-auto items-start py-3">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full resize-none border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>
          </div>

          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">Pricing & Stock</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Price Per Day (Rs)</span>
              <div className="input-shell">
                <span className="font-medium text-muted">Rs</span>
                <input
                  type="number"
                  value={form.pricePerDay}
                  onChange={(event) => setForm((current) => ({ ...current, pricePerDay: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Quantity in Stock</span>
              <div className="input-shell">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>
          </div>
        </div>

        <button type="button" className="primary-button w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
