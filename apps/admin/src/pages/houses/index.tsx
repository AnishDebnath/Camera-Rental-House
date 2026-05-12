import { useState, useMemo } from 'react';
import HouseHeader from './HouseHeader';
import HouseStats from './HouseStats';
import HouseFilters from './HouseFilters';
import HouseCard from './HouseCard';
import HouseModal from './HouseModal';
import { useToast } from '@camera-rental-house/ui';

// Mock data
export const mockHouses = [
  {
    id: '1',
    name: 'Yash Raj Films',
    ownerName: 'Ajoy Das',
    email: 'contact@yrf.com',
    phone: '9876543210',
    address: 'Andheri, Mumbai',
    totalBusiness: '₹8,45,000',
    dueAmount: '₹0',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Red Chillies',
    ownerName: 'Sameer Khan',
    email: 'info@redchillies.com',
    phone: '8976543211',
    address: 'Bandra, Mumbai',
    totalBusiness: '₹4,12,000',
    dueAmount: '₹12,500',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Dreamland Studio',
    ownerName: 'Rahul Verma',
    email: 'rahul@dreamland.in',
    phone: '8976543210',
    address: 'Kolkata, WB',
    totalBusiness: '₹1,24,000',
    dueAmount: '₹45,000',
    status: 'Pending',
  },
];

const ProductionHouses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const filteredHouses = useMemo(() => {
    let result = mockHouses;
    if (statusFilter !== 'all') {
      result = result.filter(h => h.status.toLowerCase() === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(h =>
        h.name.toLowerCase().includes(lower) ||
        h.ownerName.toLowerCase().includes(lower) ||
        h.phone.includes(lower)
      );
    }
    return result;
  }, [searchTerm, statusFilter]);

  const handleAddSuccess = () => {
    addToast({
      title: 'Success',
      message: 'Production house registered successfully.',
      tone: 'success'
    });
    // In real app, we would re-fetch data here
  };

  return (
    <div className="admin-shell space-y-5 py-6">
      <HouseHeader onAddClick={() => setIsModalOpen(true)} />

      <HouseStats
        totalHouses={24}
        activeRentals={12}
        revenue="₹8.4L"
      />

      <HouseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <HouseCard houses={filteredHouses} />

      <HouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default ProductionHouses;
