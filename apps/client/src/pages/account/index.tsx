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
import { motion, AnimatePresence } from 'framer-motion';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const TABS = [
  { id: 'details', label: 'Account Details', icon: UserRound },
  { id: 'active', label: 'Active Rentals', icon: Camera },
  { id: 'history', label: 'Rental History', icon: PackageSearch },
] as const;

type TabId = (typeof TABS)[number]['id'];

const Account = () => {
  const { user, rentals, refreshRentals, refreshUser, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const lenis = useLenis();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(user);
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [showQrFullScreen, setShowQrFullScreen] = useState(false);

  useEffect(() => {
    refreshRentals();
    refreshUser();
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

  const MOCK_RENTALS = [
    {
      id: 'ORD-77AC92B1',
      pickup_date: '2024-04-20T10:00:00Z',
      event_date: '2024-04-22T10:00:00Z',
      total_amount: 4500,
      rental_items: [
        {
          status: 'released',
          products: {
            name: 'Sony Alpha a7 IV',
            brand: 'Sony',
            product_images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200' }]
          }
        },
        {
          status: 'released',
          products: {
            name: 'Sony FE 24-70mm f/2.8 GM II',
            brand: 'Sony',
            product_images: [{ url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=200' }]
          }
        },
      ],
    },
    {
      id: 'ORD-88BD03C2',
      pickup_date: '2024-05-01T10:00:00Z',
      event_date: '2024-05-05T10:00:00Z',
      total_amount: 1200,
      rental_items: [
        {
          status: 'pending',
          products: {
            name: 'DJI Mavic 3 Pro',
            brand: 'DJI',
            product_images: [{ url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=200' }]
          }
        },
      ],
    },
    {
      id: 'ORD-11EE44F4',
      pickup_date: '2024-03-15T10:00:00Z',
      event_date: '2024-03-18T10:00:00Z',
      total_amount: 3200,
      rental_items: [
        {
          status: 'returned',
          products: {
            name: 'Canon EOS R5',
            brand: 'Canon',
            product_images: [{ url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=200' }]
          }
        },
        {
          status: 'returned',
          products: {
            name: 'Canon RF 50mm f/1.2L USM',
            brand: 'Canon',
            product_images: [{ url: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?auto=format&fit=crop&q=80&w=200' }]
          }
        },
      ],
    },
    {
      id: 'ORD-22FF55G5',
      pickup_date: '2024-02-10T10:00:00Z',
      event_date: '2024-02-12T10:00:00Z',
      total_amount: 1800,
      rental_items: [
        {
          status: 'returned',
          products: {
            name: 'Blackmagic Pocket 6K Pro',
            brand: 'Blackmagic',
            product_images: [{ url: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=200' }]
          }
        },
      ],
    },
  ];

  const allRentals = [...rentals, ...MOCK_RENTALS];

  const activeRentals = allRentals.filter((rental) =>
    rental.rental_items.some((item) => item.status !== 'returned'),
  );
  const pastRentals = allRentals.filter((rental) =>
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

      <div className="tab-content relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
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
          </motion.div>
        </AnimatePresence>
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
