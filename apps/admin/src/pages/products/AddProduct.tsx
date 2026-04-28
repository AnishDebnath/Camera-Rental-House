import { ImagePlus, Loader2, Plus, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PrintLabel from '../../components/PrintLabel';
import CustomSelect from '../../components/ui/CustomSelect';
import axiosInstance from '../../api/axiosInstance';

import { CATEGORIES_LIST as categoryOptions, BRANDS_LIST as brandOptions } from '../../../../../packages/data/categories';

type ProductForm = {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
};

type CreatedProduct = {
  name: string;
  unique_code: string;
  qr_base64: string;
};

const initialForm: ProductForm = {
  name: '',
  brand: '',
  category: '',
  description: '',
  price: '',
};

const AddProduct = () => {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<CreatedProduct | null>(null);

  const handleImages = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const remainingSlots = 5 - files.length;
    const filesArray = Array.from(selectedFiles).slice(0, remainingSlots);
    const nextPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setFiles((current) => [...current, ...filesArray]);
    setPreviews((current) => [...current, ...nextPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((current) => current.filter((_, i) => i !== index));
    setPreviews((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('pricePerDay', form.price);
      files.forEach((file) => formData.append('images', file));
      const { data } = await axiosInstance.post('/admin/products', formData);
      setCreatedProduct({ name: data.name, unique_code: data.unique_code, qr_base64: data.qr_base64 });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (createdProduct) {
    return (
      <div className="admin-shell space-y-6 py-6">
        <div className="rounded-card bg-emerald-50 p-4 border border-emerald-100 text-emerald-800 text-sm font-bold text-center">
          Product added successfully! Each item is now a unique gear identity.
        </div>
        <PrintLabel product={createdProduct} />
        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => { setCreatedProduct(null); setForm(initialForm); setPreviews([]); setFiles([]); }}
            className="secondary-button"
          >
            Add Another Gear
          </button>
          <Link to="/products" className="primary-button text-center flex items-center justify-center">
            Go to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-6 py-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Add New Gear</h1>
          <p className="mt-1 text-sm font-medium text-muted">Register a unique physical unit with QR tracking.</p>
        </div>
        <Link to="/products" className="secondary-button text-sm">
          Back to Inventory
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Images — horizontal row */}
        <div className="card-surface p-5 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-tertiary">Product Images</p>
            <p className="mt-0.5 text-[11px] text-muted">Upload up to 5 photos. First image is the primary display.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {previews.map((preview, index) => (
              <div
                key={preview}
                className="relative aspect-square rounded-card overflow-hidden border border-line"
              >
                <img src={preview} alt="" className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {previews.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-white/50 transition hover:bg-white hover:border-primary/40">
                <ImagePlus className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-bold text-muted">{previews.length === 0 ? 'Add Images' : 'Add More'}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImages(e.target.files)} />
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="card-surface p-6 space-y-6">
          <div className="border-b border-line pb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-tertiary">Product Details</p>
          </div>

          {/* Name */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-ink">Product Name <span className="text-danger">*</span></span>
            <div className="input-shell">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="e.g. Sony FX3 Cinema Line"
                className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
              />
            </div>
          </label>

          {/* Category & Brand */}
          <div className="grid gap-4 sm:grid-cols-2">
            <CustomSelect label="Category" options={categoryOptions} value={form.category} onChange={(val) => setForm((c) => ({ ...c, category: val }))} />
            <CustomSelect label="Brand" options={brandOptions} value={form.brand} onChange={(val) => setForm((c) => ({ ...c, brand: val }))} />
          </div>

          {/* Price */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-ink">Rent Price Per Day <span className="text-danger">*</span></span>
            <div className="input-shell">
              <span className="font-semibold text-muted text-sm">₹</span>
              <input
                required
                type="text"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = val.split('.');
                  const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                  setForm((c) => ({ ...c, price: finalVal }));
                }}
                placeholder="2500"
                className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
              />
            </div>
          </label>

          {/* Description */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-ink">Description</span>
            <div className="input-shell h-auto items-start py-3">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
                placeholder="Brief description of the gear features, condition, accessories included..."
                className="w-full resize-none border-0 bg-transparent p-0 text-sm focus:ring-0"
              />
            </div>
          </label>

          {/* Policy note */}
          <div className="rounded-card bg-amber-50 p-3 border border-amber-100">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Unique Identity Policy</p>
            <p className="mt-1 text-[11px] text-amber-600 leading-relaxed">
              Each gear unit is a unique physical item. Add the same model separately to track serial numbers individually.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-card bg-danger/5 p-3 text-xs font-bold text-danger border border-danger/20">
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={isLoading} className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" />Register Gear & Generate Label</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
