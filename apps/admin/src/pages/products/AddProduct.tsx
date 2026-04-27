import { ImagePlus, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PrintLabel from '../../components/PrintLabel';

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
      qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=CAM-4X9K',
    });
  };

  if (createdProduct) {
    return (
      <div className="admin-shell space-y-6 py-6">
        <PrintLabel product={createdProduct} />
        <div className="grid gap-3 md:grid-cols-2">
          <button onClick={() => setCreatedProduct(null)} className="secondary-button">
            Add Another Product
          </button>
          <Link to="/products" className="primary-button">
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Add Product</h1>
        <p className="mt-2 text-sm font-medium text-muted">Upload images, pricing, and generate a QR label.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5 md:p-6">
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-white/60 text-center transition hover:bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-card bg-primary-light text-primary">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">Upload Images</p>
            <p className="text-xs font-medium text-muted">Tap to upload or use camera</p>
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
              <img key={preview} src={preview} alt="" className="h-20 w-20 rounded-card object-cover" />
            ))}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">General Info</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Product Name</span>
              <div className="input-shell">
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. Sony FX3 Cinema Line"
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Category</span>
              <div className="input-shell">
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Description</span>
              <div className="input-shell h-auto items-start py-3">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Brief description of the product..."
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
                  placeholder="2500"
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
                  placeholder="1"
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="primary-button w-full">
          <Plus className="mr-2 h-4 w-4" />
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
