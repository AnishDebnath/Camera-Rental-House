import { useState } from 'react';
import { adminRentals } from '../../data/mockAdmin';
import { getAuthRole } from '../../../../../packages/auth';

// Modular Components
import RentalHeader from './RentalHeader';
import RentalTabs from './RentalTabs';
import RentalList from './RentalList';

const Rentals = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');

  const counts = {
    upcoming: adminRentals.upcoming.length,
    active: adminRentals.active.length,
    past: adminRentals.past.length,
  };

  return (
    <div className="admin-shell space-y-6 py-8">
      <RentalHeader isStaff={isStaff} />

      <div className="space-y-6">
        <RentalTabs 
          activeTab={activeTab} 
          setActiveTab={(tab: any) => setActiveTab(tab)} 
          counts={counts} 
        />

        <RentalList 
          rentals={adminRentals[activeTab]} 
        />
      </div>
    </div>
  );
};

export default Rentals;
