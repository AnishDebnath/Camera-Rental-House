import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { adminProducts } from '../../data/mockAdmin';
import { BRAND_ICONS, CATEGORY_ICONS, CATEGORIES, BRANDS } from '../../../../../packages/data/categories';
import { mockHouses } from '../houses/index';
import { useToast } from '@camera-rental-house/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PartnerSelection } from './PartnerSelection';
import { EquipmentSelection } from './EquipmentSelection';
import { OrderSummary } from './OrderSummary';

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const HouseBooking = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get('houseId');

  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryOptions = [
    { label: 'All Categories', value: 'All' },
    ...CATEGORIES.filter(c => c !== 'All').map(c => ({
      label: c,
      value: c,
      image: CATEGORY_ICONS[c]
    }))
  ];

  const brandOptions = [
    { label: 'All Brands', value: 'All' },
    ...BRANDS.filter(b => b !== 'All').map(b => ({
      label: b,
      value: b,
      image: BRAND_ICONS[b]
    }))
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    {
      label: 'In Stock',
      value: 'in_stock',
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" />
    },
    {
      label: 'On Rent',
      value: 'on_rent',
      icon: <Clock className="h-3 w-3 text-amber-500" />
    }
  ];

  useEffect(() => {
    if (houseId) {
      const house = mockHouses.find(h => h.id === houseId);
      if (house) setSelectedHouse(house);
    }
  }, [houseId]);

  const filteredProducts = useMemo(() => {
    return adminProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.unique_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;

      // Handle "in_stock" vs "Available" and "on_rent" vs "Rented"
      const productStatus = p.status?.toLowerCase() || '';
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'in_stock' && (productStatus === 'in_stock' || productStatus === 'available')) ||
        (statusFilter === 'on_rent' && (productStatus === 'on_rent' || productStatus === 'rented'));

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [searchTerm, categoryFilter, brandFilter, statusFilter]);

  const addToCart = (product: any) => {
    if (cart.find(item => item.id === product.id)) {
      addToast({ title: 'Already in cart', message: 'Item already added.', tone: 'warning' });
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleProcessBooking = () => {
    if (!selectedHouse || cart.length === 0) {
      addToast({ title: 'Incomplete Details', message: 'Select partner and gear.', tone: 'error' });
      return;
    }
    addToast({
      title: 'Order Generated',
      message: `Rental order for ${selectedHouse.name} is ready for collection.`,
      tone: 'success'
    });
    navigate('/rentals');
  };

  return (
    <div className="admin-shell space-y-6 py-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => navigate('/houses')}
        className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Houses
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <PartnerSelection 
            selectedHouse={selectedHouse} 
            setSelectedHouse={setSelectedHouse} 
            houseId={houseId} 
          />
          <EquipmentSelection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryOptions={categoryOptions}
            brandOptions={brandOptions}
            statusOptions={statusOptions}
            filteredProducts={filteredProducts}
            addToCart={addToCart}
          />
        </div>

        {/* Right Column: Order Summary */}
        <OrderSummary 
          cart={cart} 
          removeFromCart={removeFromCart} 
          handleProcessBooking={handleProcessBooking} 
        />
      </div>
    </div>
  );
};

export default HouseBooking;
