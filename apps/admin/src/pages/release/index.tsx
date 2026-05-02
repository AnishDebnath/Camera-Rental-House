import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { adminRentals } from '../../data/mockAdmin';
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

  const handleSearch = () => {
    setError(null);
    const all = [
      ...adminRentals.upcoming,
      ...adminRentals.active,
      ...adminRentals.returning,
    ];
    const found = all.find((r) => r.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setActiveRental(found);
    } else {
      setError('Booking ID not found. Please verify and try again.');
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
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Release Gear</h1>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
              Verify products and user identity for secure gear handoff.
            </p>
          </div>
        </header>
      )}

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
            onCapture={() =>
              setProofPhoto(
                'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80'
              )
            }
            onClearPhoto={() => setProofPhoto(null)}
            onRelease={() => setIsComplete(true)}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReleaseReturn;
