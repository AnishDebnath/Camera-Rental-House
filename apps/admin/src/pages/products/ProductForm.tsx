import { ImagePlus, Loader2, Plus, Save, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PrintLabel from '../../components/PrintLabel';
import CustomSelect from '../../components/ui/CustomSelect';
import axiosInstance from '../../api/axiosInstance';
import { CATEGORIES_LIST as categoryOptions, BRANDS_LIST as brandOptions } from '../../../../../packages/data/categories';

type ProductFormState = {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
};

const initialForm: ProductFormState = {
  name: '',
  brand: '',
  category: '',
  description: '',
  price: '',
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Mode specific
  const [createdProduct, setCreatedProduct] = useState<any | null>(null);

  // Edit Mode specific
  const [product, setProduct] = useState<any>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removeImageUrls, setRemoveImageUrls] = useState<string[]>([]);

  // Shared file upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${id}`);
          setProduct(data);
          setExistingImages(data.images || []);
          setForm({
            name: data.name,
            brand: data.brand,
            category: data.category,
            description: data.description,
            price: String(data.price_per_day),
          });
        } catch (err) {
          setError('Failed to load gear details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleNewImages = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const remainingSlots = 5 - (existingImages.length - removeImageUrls.length + newFiles.length);
    const filesArray = Array.from(selectedFiles).slice(0, remainingSlots);
    const previewsArray = filesArray.map(file => URL.createObjectURL(file));
    setNewFiles(prev => [...prev, ...filesArray]);
    setNewPreviews(prev => [...prev, ...previewsArray]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRemoveExisting = (url: string) => {
    setRemoveImageUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const activeImagesCount = existingImages.length - removeImageUrls.length + newFiles.length;
    if (activeImagesCount === 0) {
      setError('Please upload at least one product image.');
      return;
    }
    if (!form.category) {
      setError('Please select a category.');
      return;
    }
    if (!form.brand) {
      setError('Please select a brand.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('pricePerDay', form.price);

      newFiles.forEach(file => formData.append('images', file));

      if (isEditMode) {
        formData.append('removeImageUrls', JSON.stringify(removeImageUrls));
        await axiosInstance.put(`/admin/products/${id}`, formData);
        alert('Changes saved successfully.');
        navigate('/products');
      } else {
        const { data } = await axiosInstance.post('/admin/products', formData);
        setCreatedProduct({ name: data.name, unique_code: data.unique_code, qr_base64: data.qr_base64 });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (createdProduct && !isEditMode) {
    return (
      <div className="admin-shell space-y-6 py-6">
        <div className="rounded-card bg-emerald-50 p-4 border border-emerald-100 text-emerald-800 text-sm font-bold text-center">
          Product added successfully! Each product is now a unique product identity.
        </div>
        <PrintLabel product={createdProduct} />
        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => { setCreatedProduct(null); setForm(initialForm); setNewPreviews([]); setNewFiles([]); }}
            className="secondary-button"
          >
            Add Another Product
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{isEditMode ? 'Edit Gear' : 'Add New Product'}</h1>
          <p className="mt-1 text-sm font-medium text-muted">
            {isEditMode ? 'Update details for this specific gear unit.' : 'Register a unique physical unit with QR tracking.'}
          </p>
        </div>
        <Link to="/products" className="secondary-button text-sm w-fit">
          Back to Inventory
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Images */}
        <div className="card-surface p-5 space-y-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-tertiary">Product Images <span className="text-danger">*</span></p>
            <p className="mt-1 text-sm text-muted">Upload up to 5 photos. First image is the primary display.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {/* Existing Images */}
            {isEditMode && existingImages.map((url, index) => (
              <div key={url} className={`relative aspect-square rounded-card overflow-hidden border ${removeImageUrls.includes(url) ? 'opacity-40 grayscale border-danger' : 'border-line'}`}>
                <img src={url} alt="" className="h-full w-full object-cover" />
                {index === 0 && !removeImageUrls.includes(url) && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary/80 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">Primary</span>
                )}
                <button
                  type="button"
                  onClick={() => toggleRemoveExisting(url)}
                  className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white backdrop-blur-sm shadow-sm transition ${removeImageUrls.includes(url) ? 'bg-primary' : 'bg-black/50 hover:bg-danger'}`}
                >
                  {removeImageUrls.includes(url) ? <Plus className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </button>
              </div>
            ))}

            {/* New Previews */}
            {newPreviews.map((preview, index) => (
              <div key={preview} className="relative aspect-square rounded-card overflow-hidden border border-line">
                <img src={preview} alt="" className="h-full w-full object-cover" />
                {!isEditMode && index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary/80 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">Primary</span>
                )}
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {(existingImages.length - removeImageUrls.length + newFiles.length) < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-primary/40 bg-white/50">
                <ImagePlus className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold text-muted">{(existingImages.length - removeImageUrls.length + newFiles.length) === 0 ? 'Add Images' : 'Add More'}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleNewImages(e.target.files)} />
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="card-surface p-6 space-y-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-tertiary">Product Details</p>
          </div>

          <label className="block space-y-2">
            <span className="text-base font-semibold text-ink">Product Name <span className="text-danger">*</span></span>
            <div className="input-shell">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="e.g. Sony FX3 Cinema Line"
                className="w-full border-0 bg-transparent p-0 text-base focus:ring-0"
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomSelect required label="Category" options={categoryOptions} value={form.category} onChange={(val) => setForm((c) => ({ ...c, category: val }))} />
            <CustomSelect required label="Brand" options={brandOptions} value={form.brand} onChange={(val) => setForm((c) => ({ ...c, brand: val }))} />
          </div>

          <label className="block space-y-2">
            <span className="text-base font-semibold text-ink">Rent Price Per Day <span className="text-danger">*</span></span>
            <div className="input-shell">
              <span className="font-semibold text-muted text-base">₹</span>
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
                className="w-full border-0 bg-transparent p-0 text-base focus:ring-0"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-base font-semibold text-ink">Description <span className="text-danger">*</span></span>
            <div className="input-shell h-auto items-start py-3">
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
                placeholder="Brief description of the gear features, condition, accessories included..."
                className="w-full resize-none border-0 bg-transparent p-0 text-base focus:ring-0"
              />
            </div>
          </label>

          {isEditMode && product ? (
            <div className="rounded-card bg-amber-50 p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Warning: Active Product</p>
              <p className="mt-1 text-sm text-amber-600 leading-relaxed">
                A QR code and unique product code ({product.unique_code}) are already generated and actively tracked for this product. Please do not change major details to avoid mismatching physical asset labels.
              </p>
            </div>
          ) : (
            <div className="rounded-card bg-amber-50 p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Unique Identity Policy</p>
              <p className="mt-1 text-sm text-amber-600 leading-relaxed">
                Each product is a unique physical item. Add the same model separately to track serial numbers individually.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-card bg-danger/5 p-3 text-sm font-bold text-danger border border-danger/20">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSaving} className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditMode ? 'Saving Changes...' : 'Processing...'}</>
            ) : isEditMode ? (
              <><Save className="mr-2 h-4 w-4" />Save Changes</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" />Register Gear & Generate Label</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
