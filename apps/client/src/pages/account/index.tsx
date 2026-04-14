import { useEffect, useState } from 'react';
import { Camera, PackageSearch, UserRound } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../store/ToastContext';
import { useLenis } from '../../context/LenisContext';
import { resolveAuthAppUrl } from '../../../../../packages/auth/appUrls';

import AccountHeader from './AccountHeader';
import AccountTabs from './AccountTabs';
import AccountDetailsTab from './AccountDetailsTab';
import ActiveRentalsTab from './ActiveRentalsTab';
import RentalHistoryTab from './RentalHistoryTab';
import QrModal from './QrModal';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const TABS = [
  { id: 'details', label: 'Account Details', icon: UserRound },
  { id: 'active', label: 'Active Rentals', icon: Camera },
  { id: 'history', label: 'Rental History', icon: PackageSearch },
] as const;

type TabId = (typeof TABS)[number]['id'];

const Account = () => {
  const { user, rentals, refreshRentals, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const lenis = useLenis();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(user);
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [showQrFullScreen, setShowQrFullScreen] = useState(false);

  useEffect(() => {
    refreshRentals();
  }, []);

  useEffect(() => {
    if (user) setDraft(user);
  }, [user]);

  // Handle scroll lock (Lenis) when QR modal is open
  useEffect(() => {
    if (showQrFullScreen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => lenis?.start();
  }, [showQrFullScreen, lenis]);

  if (!user) {
    return null;
  }

  const activeRentals = rentals.filter((rental) =>
    rental.rental_items.some((item) => item.status !== 'returned'),
  );
  const pastRentals = rentals.filter((rental) =>
    rental.rental_items.every((item) => item.status === 'returned'),
  );

  const handleSave = async () => {
    if (!draft) return;
    setLoading(true);
    try {
      await updateProfile(draft);
      addToast('Profile updated successfully', 'success');
      setEditing(false);
    } catch (error) {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    window.location.replace(`${authAppUrl}/login`);
  };

  const memberSince = user.createdAt
    ? `Since ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : 'Since July 2024';

  return (
    <div className="page-animate app-shell space-y-6 pb-24 pt-4 md:space-y-8">
      <AccountHeader 
        user={user} 
        onSignOut={handleSignOut} 
        onOpenQr={() => setShowQrFullScreen(true)} 
      />

      <AccountTabs 
        tabs={TABS} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="tab-content">
        {activeTab === 'details' && draft && (
          <AccountDetailsTab
            draft={draft}
            editing={editing}
            loading={loading}
            onSetEditing={setEditing}
            onDraftChange={(key, value) => setDraft((prev: any) => ({ ...prev, [key]: value }))}
            onSave={handleSave}
          />
        )}

        {activeTab === 'active' && (
          <ActiveRentalsTab activeRentals={activeRentals} />
        )}

        {activeTab === 'history' && (
          <RentalHistoryTab pastRentals={pastRentals} />
        )}
      </div>

      <QrModal
        show={showQrFullScreen}
        onClose={setShowQrFullScreen}
        user={user}
        memberSince={memberSince}
        lenis={lenis}
      />
    </div>
  );
};

export default Account;
