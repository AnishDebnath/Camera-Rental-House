import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Package, 
  User, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { adminProducts } from '../data/mockAdmin';
import { useToast } from '@camera-rental-house/ui';
import { useNavigate } from 'react-router-dom';

const mockHouses = [
  { id: '1', name: 'Dreamscape Studios', members: ['John Smith', 'Robert Brown', 'Emily Davis'] },
  { id: '2', name: 'Pixel Perfect Productions', members: ['Sarah Wilson', 'Kevin Hart'] },
  { id: '3', name: 'Urban Frame Media', members: ['Mike Johnson'] },
];

const AdminBooking = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = adminProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.unique_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    if (cart.find(item => item.id === product.id)) {
      addToast({ title: 'Already in cart', message: 'Item already added to this booking.', tone: 'warning' });
      return;
    }
    setCart([...cart, { ...product, bookingDays: 1 }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleProcessBooking = () => {
    if (!selectedHouse || !selectedMember || cart.length === 0) {
      addToast({ title: 'Incomplete Details', message: 'Please select a house, member, and at least one item.', tone: 'error' });
      return;
    }

    addToast({ 
      title: 'Booking Successful', 
      message: `Order created for ${selectedHouse.name} and released to ${selectedMember}.`, 
      tone: 'success' 
    });
    navigate('/rentals');
  };

  return (
    <div className="admin-shell py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink">Admin Booking</h1>
        <p className="text-sm font-medium text-muted">Create a rental order on behalf of a production house.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: House & Member */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>
              Partner Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Production House</label>
                <select 
                  className="w-full rounded-xl border-line bg-slate-50 text-sm font-medium focus:ring-primary"
                  onChange={(e) => {
                    const house = mockHouses.find(h => h.id === e.target.value);
                    setSelectedHouse(house);
                    setSelectedMember('');
                  }}
                >
                  <option value="">Select House...</option>
                  {mockHouses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Receiving Person</label>
                <select 
                  disabled={!selectedHouse}
                  className="w-full rounded-xl border-line bg-slate-50 text-sm font-medium focus:ring-primary disabled:opacity-50"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Select Member...</option>
                  {selectedHouse?.members.map((m: string) => <option key={m} value={m}>{m}</option>)}
                  <option value="other">Other (Walk-in representative)</option>
                </select>
              </div>
            </div>
            {selectedMember === 'other' && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Name of Representative</label>
                <input 
                  type="text" 
                  className="mt-1.5 w-full rounded-xl border-line bg-slate-50 text-sm font-medium focus:ring-primary"
                  placeholder="Enter representative name..."
                />
              </div>
            )}
          </div>

          {/* Step 2: Gear Selection */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>
              Select Gears
            </h2>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search inventory by name or code..."
                className="w-full rounded-xl border-line bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-line p-3 hover:border-primary/30 transition-colors">
                    <img src={product.image} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{product.name}</p>
                      <p className="text-[10px] font-bold text-muted uppercase">{product.unique_code}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-ink hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-line bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-black">Release Summary</h2>
              <Package className="h-6 w-6 text-primary" />
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white">
                  <Package className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">Cart is Empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-[10px] text-white/40 uppercase font-bold">{item.unique_code}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-white/5 p-4 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-white/60">
                    <span>Partner</span>
                    <span className="text-white">{selectedHouse?.name || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white/60">
                    <span>Released To</span>
                    <span className="text-white">{selectedMember || '---'}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <p className="text-sm font-black text-white">Status</p>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Ready for Release</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleProcessBooking}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                >
                  Generate Order & Release
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Info className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-ink">Important Note</h3>
                <p className="text-xs leading-relaxed text-muted font-medium">
                  Booking on behalf of a partner will bypass the standard verification check as the house identity is already verified. The order will be marked as "Released" immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;
