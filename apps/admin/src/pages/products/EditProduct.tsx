import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, Plus, Save, X } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';
import axiosInstance from '../../api/axiosInstance';

// Category Images
import CameraImg from '../../../../../packages/ui/assets/categories/camera.png';
import LenseImg from '../../../../../packages/ui/assets/categories/lense.png';
import LightImg from '../../../../../packages/ui/assets/categories/light.png';
import AudioImg from '../../../../../packages/ui/assets/categories/mic.png';
import TripodImg from '../../../../../packages/ui/assets/categories/tripod.png';

// Brand Images
import CanonImg from '../../../../../packages/ui/assets/brands/canon.png';
import SonyImg from '../../../../../packages/ui/assets/brands/sony.png';
import LeicaImg from '../../../../../packages/ui/assets/brands/leica.png';
import NikonImg from '../../../../../packages/ui/assets/brands/nikon.png';
import ZeissImg from '../../../../../packages/ui/assets/brands/zeiss.png';

const categoryOptions = [
  { name: 'Cameras', image: CameraImg },
  { name: 'Lenses', image: LenseImg },
  { name: 'Lights', image: LightImg },
  { name: 'Audio', image: AudioImg },
  { name: 'Tripods', image: TripodImg },
];

const brandOptions = [
  { name: 'Canon', image: CanonImg },
  { name: 'Sony', image: SonyImg },
  { name: 'Leica', image: LeicaImg },
  { name: 'Nikon', image: NikonImg },
  { name: 'Zeiss', image: ZeissImg },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Image states
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removeImageUrls, setRemoveImageUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    brand: 'Sony',
    category: 'Cameras',
    description: '',
    price: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
        setExistingImages(data.images || []);
        setForm({
          name: data.name,
          brand: data.brand || 'Sony',
          category: data.category,
          description: data.description || '',
          price: String(data.price_per_day),
        });
      } catch (err) {
        setError('Failed to load gear details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleNewImages = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const filesArray = Array.from(selectedFiles);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('pricePerDay', form.price);
      formData.append('removeImageUrls', JSON.stringify(removeImageUrls));

      newFiles.forEach(file => {
        formData.append('images', file);
      });

      await axiosInstance.put(`/admin/products/${id}`, formData);

      alert('Changes saved successfully.');
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes.');
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

  if (error && !product) {
    return (
      <div className="admin-shell py-12 text-center">
        <p className="text-danger font-bold">{error}</p>
        <Link to="/products" className="mt-4 inline-block text-primary underline">Back to Inventory</Link>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Edit Gear</h1>
          <p className="mt-2 text-sm font-medium text-muted">Update details for this specific gear unit.</p>
        </div>
        <Link to="/products" className="secondary-button text-xs">Back to Inventory</Link>
      </div>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5 md:p-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">Product Images</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {/* Existing Images */}
            {existingImages.map((url) => (
              <div key={url} className={`relative aspect-square rounded-card border ${removeImageUrls.includes(url) ? 'opacity-40 grayscale border-danger' : 'border-line'}`}>
                <img src={url} alt="" className="h-full w-full rounded-card object-cover" />
                <button
                  type="button"
                  onClick={() => toggleRemoveExisting(url)}
                  className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${removeImageUrls.includes(url) ? 'bg-primary text-white' : 'bg-danger text-white'}`}
                >
                  {removeImageUrls.includes(url) ? <Plus className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </button>
              </div>
            ))}
            
            {/* New Previews */}
            {newPreviews.map((preview, index) => (
              <div key={preview} className="relative aspect-square">
                <img src={preview} alt="" className="h-full w-full rounded-card object-cover border border-primary/30 shadow-sm" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {(existingImages.length - removeImageUrls.length + newFiles.length) < 8 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-white/60 transition hover:bg-white">
                <ImagePlus className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-bold text-muted">Add New</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleNewImages(e.target.files)}
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">General Info</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Product Name</span>
              <div className="input-shell">
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <CustomSelect
                label="Category"
                options={categoryOptions}
                value={form.category}
                onChange={(val) => setForm((current) => ({ ...current, category: val }))}
              />

              <CustomSelect
                label="Brand"
                options={brandOptions}
                value={form.brand}
                onChange={(val) => setForm((current) => ({ ...current, brand: val }))}
              />
            </div>

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">Financials</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Rent Price Per Day (Rs)</span>
              <div className="input-shell">
                <span className="font-medium text-muted">Rs</span>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(event) => {
                    const val = event.target.value.replace(/[^0-9.]/g, '');
                    const parts = val.split('.');
                    const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                    setForm((current) => ({ ...current, price: finalVal }));
                  }}
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>
            
            <div className="rounded-card bg-slate-50 p-4 border border-line">
              <p className="text-xs font-bold text-ink">Unique Asset Tracking</p>
              <p className="mt-1 text-[11px] text-muted leading-relaxed">
                This item is tracked by its unique code ({product.unique_code}). All history, including rentals and maintenance, is tied to this specific unit.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-card bg-danger/10 p-3 text-xs font-bold text-danger">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSaving}
          className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
