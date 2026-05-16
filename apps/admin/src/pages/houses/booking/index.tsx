import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Building2 } from 'lucide-react';
import { BRAND_ICONS, CATEGORY_ICONS, CATEGORIES, BRANDS } from '../../../../../../packages/data/categories';
import { useToast } from '@camera-rental-house/ui';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

import { PartnerSelection } from './PartnerSelection';
import { DateSelection } from './DateSelection';
import { EquipmentSelection } from './EquipmentSelection';
import { OrderSummary } from './OrderSummary';

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const HouseBooking = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [isLoadingHouse, setIsLoadingHouse] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      if (!slug) return;
      setIsLoadingHouse(true);
      try {
        const res = await axiosInstance.get(`/admin/houses/slug/${slug}`);
        setSelectedHouse(res.data);
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch house details.', tone: 'error' });
      } finally {
        setIsLoadingHouse(false);
      }
    };
    fetchHouse();
  }, [slug, addToast]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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



  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products', {
          params: {
            search: searchTerm,
            category: categoryFilter,
            brand: brandFilter,
            status: statusFilter,
            limit: 100
          }
        });
        const mapped = data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          price_per_day: item.price_per_day,
          status: item.status,
          available_quantity: item.available_quantity,
          unique_code: item.unique_code,
          image: item.images?.[0] ?? null,
        }));
        setFilteredProducts(mapped);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
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

  if (isLoadingHouse) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

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

      {!selectedHouse ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
            <Building2 className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-black text-ink">House Not Found</h2>
          <p className="mt-2 text-sm font-medium text-muted">The production house could not be identified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <PartnerSelection
              selectedHouse={selectedHouse}
            />
            <DateSelection
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
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
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          </div>

          {/* Right Column: Order Summary */}
          <OrderSummary
            cart={cart}
            removeFromCart={removeFromCart}
            handleProcessBooking={handleProcessBooking}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}
    </div>
  );
};

export default HouseBooking;
