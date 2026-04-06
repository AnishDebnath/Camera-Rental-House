import { ImagePlus, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PrintLabel from '../components/PrintLabel';

const categories = ['Cameras', 'Lenses', 'Lights', 'Audio', 'Tripods', 'Drones', 'Accessories'];

type ProductForm = {
  name: string;
  category: string;
  description: string;
  pricePerDay: string;
  quantity: string;
};

type CreatedProduct = {
  name: string;
  unique_code: string;
  qr_base64: string;
};

const initialForm = {
  name: '',
  category: 'Cameras',
  description: '',
  pricePerDay: '',
  quantity: '1',
} satisfies ProductForm;

const productFields = [
  { key: 'name', label: 'Product Name' },
  { key: 'description', label: 'Description' },
  { key: 'pricePerDay', label: 'Price Per Day' },
  { key: 'quantity', label: 'Quantity' },
] as const;

const AddProduct = () => {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [previews, setPreviews] = useState<string[]>([]);
  const [createdProduct, setCreatedProduct] = useState<CreatedProduct | null>(null);

  const handleImages = (files: FileList | null) => {
    const nextPreviews = Array.from(files || []).map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatedProduct({
      name: form.name || 'New Product',
      unique_code: 'CAM-4X9K',
      qr_base64:
        'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=CAM-4X9K',
    });
  };

  if (createdProduct) {
    return (
      <div className="admin-shell space-y-6 py-6">
        <PrintLabel product={createdProduct} />
        <div className="grid gap-3 md:grid-cols-2">
          <Link to="/products/add" className="secondary-button">
            Add Another Product
          </Link>
          <Link to="/products" className="primary-button">
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Add Product</h1>
        <p className="text-sm text-muted">Upload images, pricing, and generate a QR label.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5">
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-page text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Upload Images</p>
            <p className="text-xs text-muted">Tap to upload or use camera</p>
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={(event) => handleImages(event.target.files)}
          />
        </label>

        {previews.length ? (
          <div className="flex flex-wrap gap-3">
            {previews.map((preview) => (
              <img key={preview} src={preview} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            ))}
          </div>
        ) : null}

        {productFields.map(({ key, label }) => (
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

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink">Category</span>
          <div className="input-shell">
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </label>

        <button type="submit" className="primary-button w-full">
          <Plus className="mr-2 h-4 w-4" />
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
