import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductVerificationModal from './ProductVerificationModal';
import UserVerificationModal from './UserVerificationModal';
import Step1Products from './Step1Products';
import Step2UserIdentity from './Step2UserIdentity';
import Step3Proof from './Step3Proof';
import ReleaseSummary from './ReleaseSummary';

interface Props {
  rental: any;
  scannedProducts: string[];
  onVerifyProduct: (id: string) => void;
  isUserVerified: boolean;
  onToggleVerify: () => void;
  proofPhoto: string | null;
  onCapture: (photo: string) => void;
  onClearPhoto: () => void;
  onRelease: () => void;
  onReset: () => void;
}

const ReleaseVerify = ({
  rental,
  scannedProducts,
  onVerifyProduct,
  isUserVerified,
  onToggleVerify,
  proofPhoto,
  onCapture,
  onClearPhoto,
  onRelease,
  onReset,
}: Props) => {
  const [verifyingProduct, setVerifyingProduct] = useState<any>(null);
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);
  const allProductsScanned = rental.products.every((p: any) => scannedProducts.includes(p.id));

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid gap-6 lg:grid-cols-12"
    >
      <AnimatePresence>
        {verifyingProduct && (
          <ProductVerificationModal
            product={verifyingProduct}
            onClose={() => setVerifyingProduct(null)}
            onVerify={onVerifyProduct}
          />
        )}
        {isVerifyingUser && (
          <UserVerificationModal
            user={{
              id: rental.user_id,
              name: rental.name,
              phone: rental.phone,
              image: rental.user_image
            }}
            onClose={() => setIsVerifyingUser(false)}
            onVerify={onToggleVerify}
          />
        )}
      </AnimatePresence>

      {/* Left Column: Verification Steps */}
      <div className="lg:col-span-7 space-y-5">
        <Step1Products
          products={rental.products}
          scannedProducts={scannedProducts}
          onVerifyClick={setVerifyingProduct}
        />

        <Step2UserIdentity
          user={{
            id: rental.user_id,
            name: rental.name,
            phone: rental.phone,
            image: rental.user_image,
          }}
          isVerified={isUserVerified}
          onToggleVerify={() => setIsVerifyingUser(true)}
        />

        <Step3Proof
          photo={proofPhoto}
          onCapture={onCapture}
          onClear={onClearPhoto}
        />
      </div>

      {/* Right Column: Summary & Action */}
      <div className="lg:col-span-5 space-y-5">
        <ReleaseSummary
          allProductsScanned={allProductsScanned}
          isUserVerified={isUserVerified}
          hasProofPhoto={!!proofPhoto}
          onRelease={onRelease}
          onReset={onReset}
        />
      </div>
    </motion.div>
  );
};

export default ReleaseVerify;
