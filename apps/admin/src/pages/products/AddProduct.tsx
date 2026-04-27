import { ImagePlus, Loader2, Plus, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PrintLabel from '../../components/PrintLabel';
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
  brand: 'Sony',
  category: 'Cameras',
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
    
    // Limit to 5 images total
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
      
      files.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await axiosInstance.post('/admin/products', formData);

      setCreatedProduct({
        name: data.name,
        unique_code: data.unique_code,
        qr_base64: data.qr_base64,
      });
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      const networkMessage = err.message;
      setError(serverMessage || networkMessage || 'Failed to create product. Please try again.');
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
          <button onClick={() => {
            setCreatedProduct(null);
            setForm(initialForm);
            setPreviews([]);
          }} className="secondary-button">
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
    <div className="admin-shell space-y-5 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Add New Gear</h1>
        <p className="mt-2 text-sm font-medium text-muted">Register a unique gear identity with specific branding and QR label.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5 md:p-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-tertiary">Product Images (Max 5)</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {previews.map((preview, index) => (
              <div key={preview} className="relative aspect-square">
                <img src={preview} alt="" className="h-full w-full rounded-card object-cover border border-line" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-white/60 transition hover:bg-white">
                <ImagePlus className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-bold text-muted">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => handleImages(event.target.files)}
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
                  placeholder="e.g. Sony FX3 Cinema Line"
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
                  placeholder="Brief description of the gear features..."
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
                    // Ensure only one decimal point
                    const parts = val.split('.');
                    const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                    setForm((current) => ({ ...current, price: finalVal }));
                  }}
                  placeholder="2500"
                  className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                />
              </div>
            </label>

            <div className="rounded-card bg-amber-50 p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-800">Unique Identity Policy</p>
              <p className="mt-1 text-[11px] text-amber-700 leading-relaxed">
                In this system, each gear is registered as a unique physical unit. Multiple quantities of the same model must be added individually to maintain separate tracking, serial numbers, and maintenance logs.
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
          disabled={isLoading}
          className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Register Gear & Generate Label
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
