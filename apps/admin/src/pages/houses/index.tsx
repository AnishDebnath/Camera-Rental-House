import { useState, useMemo } from 'react';
import HouseHeader from './HouseHeader';
import HouseStats from './HouseStats';
import HouseFilters from './HouseFilters';
import HouseList from './HouseList';
import HouseModal from './HouseModal';
import { useToast } from '@camera-rental-house/ui';

// Mock data
const mockHouses = [
  { 
    id: '1', 
    name: 'Dreamscape Studios', 
    contact: 'John Smith', 
    email: 'john@dreamscape.com',
    phone: '+91 98765 43210', 
    address: 'Bandra West, Mumbai',
    usersCount: 12, 
    status: 'Active',
    totalSpent: '₹1,24,000'
  },
  { 
    id: '2', 
    name: 'Pixel Perfect Productions', 
    contact: 'Sarah Wilson', 
    email: 'sarah@pixelperfect.in',
    phone: '+91 87654 32109', 
    address: 'Hitech City, Hyderabad',
    usersCount: 8, 
    status: 'Active',
    totalSpent: '₹84,500'
  },
  { 
    id: '3', 
    name: 'Urban Frame Media', 
    contact: 'Mike Johnson', 
    email: 'mike@urbanframe.com',
    phone: '+91 76543 21098', 
    address: 'Indiranagar, Bangalore',
    usersCount: 5, 
    status: 'Pending',
    totalSpent: '₹12,000'
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
        h.contact.toLowerCase().includes(lower)
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

      <HouseList houses={filteredHouses} />

      <HouseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default ProductionHouses;
