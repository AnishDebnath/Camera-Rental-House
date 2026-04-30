import { Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { BRAND_ICONS, CATEGORY_ICONS, CATEGORIES, BRANDS } from '../../../../../packages/data/categories';

// Modular Components
import ProductHeader from './ProductHeader';
import ProductStats from './ProductStats';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import QRLabelModal from './QRLabelModal';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Products = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedQrProduct, setSelectedQrProduct] = useState<any>(null);
  const [loadingQrId, setLoadingQrId] = useState<string | null>(null);

  useEffect(() => {
    if (!showFilters) setIsExpanded(false);
  }, [showFilters]);

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

  const handleShowQr = async (row: any) => {
    try {
      setLoadingQrId(row.id);
      const { data } = await axiosInstance.get(`/products/${row.id}`);
      setSelectedQrProduct(data);
    } catch (err) {
      alert('Failed to load QR code details.');
    } finally {
      setLoadingQrId(null);
    }
  };

  const handleDelete = async (row: any) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await axiosInstance.delete(`/admin/products/${row.id}`);
        setRows((current) => current.filter((item) => item.id !== row.id));
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
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
        unique_code: item.unique_code,
        available_quantity: item.available_quantity,
        image: item.images?.[0] ?? null,
        created_at: new Date(item.created_at).toLocaleDateString(),
      }));
      setRows(mapped);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, brandFilter, statusFilter]);

  return (
    <div className="admin-shell space-y-6 py-8">
      <ProductHeader />

      <div className="space-y-6">
        {!isLoading || rows.length > 0 ? (
          <>
            <ProductStats 
              totalItems={rows.length}
              rentedItems={rows.filter(r => r.available_quantity === 0).length}
              inStockItems={rows.filter(r => r.available_quantity === 1).length}
            />

            <ProductFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryOptions={categoryOptions}
              brandOptions={brandOptions}
              statusOptions={statusOptions}
            />

            <ProductCard 
              rows={rows}
              isLoading={isLoading}
              loadingQrId={loadingQrId}
              handleShowQr={handleShowQr}
              handleDelete={handleDelete}
              formatCurrency={formatCurrency}
            />
          </>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-card bg-white/50 border border-line">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {selectedQrProduct && (
        <QRLabelModal 
          product={selectedQrProduct} 
          onClose={() => setSelectedQrProduct(null)} 
        />
      )}
    </div>
  );
};

export default Products;
