import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminProducts } from '../data/mockAdmin';

const EditProduct = () => {
  const { id } = useParams();
  const product = useMemo(
    () => adminProducts.find((item) => item.id === id) || adminProducts[0],
    [id],
  );
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: 'Pre-filled product description for editing.',
    pricePerDay: product.price_per_day,
    quantity: product.quantity,
  });

  return (
    <div className="admin-shell space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Edit Product</h1>
        <p className="text-sm text-muted">Update inventory, pricing, and image set.</p>
      </div>

      <form className="card-surface space-y-5 p-5">
        <div className="flex flex-wrap gap-3">
          <img src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
        </div>

        {[
          ['name', 'Product Name'],
          ['category', 'Category'],
          ['description', 'Description'],
          ['pricePerDay', 'Price Per Day'],
          ['quantity', 'Quantity'],
        ].map(([key, label]) => (
          <label key={key} className="space-y-2">
            <span className="text-sm font-medium text-ink">{label}</span>
            <div className="input-shell">
              {key === 'description' ? (
                <textarea
                  rows={4}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              ) : (
                <input
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              )}
            </div>
          </label>
        ))}

        <button type="button" className="primary-button w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
