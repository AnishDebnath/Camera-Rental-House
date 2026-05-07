import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ReleaseSearch from './ReleaseSearch';
import ReleaseVerify from './ReleaseVerify';
import ReleaseSuccess from './ReleaseSuccess';

const ReleaseReturn = () => {
  const [searchId, setSearchId] = useState('');
  const [activeRental, setActiveRental] = useState<any>(null);
  const [scannedProducts, setScannedProducts] = useState<string[]>([]);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/rentals/${searchId.trim()}`);
      const rental = response.data;

      // Map DB rental to UI format
      const mappedRental = {
        id: rental.id.split('-')[0].toUpperCase(),
        full_id: rental.id,
        name: rental.users?.full_name || 'Guest',
        phone: rental.users?.phone || 'N/A',
        member_id: rental.users?.member_id,
        user_image: rental.users?.avatar_url || '',
        user_id: rental.user_id,
        pickup: rental.pickup_date,
        return_date: rental.event_date,
        status: rental.status,
        products: (rental.rental_items || []).map((item: any) => ({
          id: item.product_id,
          name: item.products?.name || 'Unknown',
          image: item.products?.images?.[0] || '',
          status: item.status,
          unique_code: item.products?.unique_code
        }))
      };

      setActiveRental(mappedRental);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.message || 'Booking ID not found. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveRental(null);
    setSearchId('');
    setScannedProducts([]);
    setIsUserVerified(false);
    setProofPhoto(null);
    setIsComplete(false);
    setError(null);
  };

  const handleRelease = async () => {
    if (!activeRental || scannedProducts.length === 0) return;

    setLoading(true);
    try {
      const isReturn = activeRental.status === 'released' || activeRental.products.some((p: any) => p.status === 'released');
      const endpoint = isReturn ? '/manage/bulk-return' : '/manage/bulk-release';

      await axiosInstance.post(endpoint, {
        rentalId: activeRental.full_id,
        productIds: scannedProducts
      });

      setIsComplete(true);
    } catch (err: any) {
      console.error('Action failed:', err);
      setError(err.response?.data?.message || 'Failed to process gear. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductScan = (id: string) => {
    setScannedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isComplete) {
    return <ReleaseSuccess rental={activeRental} onReset={handleReset} />;
  }

  return (
    <div className="admin-shell py-8">
      {/* Header — only show when rental record is loaded */}
      {activeRental && (
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {activeRental.status === 'released' ? 'Return Gear' : 'Release Gear'}
            </h1>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
              {activeRental.status === 'released'
                ? 'Verify returned products and update inventory.'
                : 'Verify products and user identity for secure gear handoff.'}
            </p>
          </div>
        </header>
      )}

      {loading && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
          <p className="text-sm font-bold text-muted">Fetching rental records...</p>
        </div>
      )}

      {!loading && (
        <AnimatePresence mode="wait">
          {!activeRental ? (
            <ReleaseSearch
              key="search"
              searchId={searchId}
              setSearchId={setSearchId}
              onSearch={handleSearch}
              error={error}
            />
          ) : (
            <ReleaseVerify
              key="verify"
              rental={activeRental}
              scannedProducts={scannedProducts}
              onVerifyProduct={toggleProductScan}
              isUserVerified={isUserVerified}
              onToggleVerify={() => setIsUserVerified((v) => !v)}
              proofPhoto={proofPhoto}
              onCapture={(photo) => setProofPhoto(photo)}
              onClearPhoto={() => setProofPhoto(null)}
              onRelease={handleRelease}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReleaseReturn;
