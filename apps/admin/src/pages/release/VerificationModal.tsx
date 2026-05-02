import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, QrCode, ScanLine } from 'lucide-react';

interface Props {
  product: any;
  onClose: () => void;
  onVerify: (id: string) => void;
}

const VerificationModal = ({ product, onClose, onVerify }: Props) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (inputCode.toLowerCase() === product.id.toLowerCase()) {
      onVerify(product.id);
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Verify Product</h3>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4 rounded-xl border border-line p-3 bg-slate-50/50">
          <img
            src={product.image}
            className="h-12 w-12 rounded-lg object-cover border border-line"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{product.name}</p>
            <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest mt-0.5">
              ID: {product.id}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              type="text"
              placeholder="Enter Product Code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition-all ${
                error
                  ? 'border-rose-500 bg-rose-50 ring-4 ring-rose-500/10'
                  : 'border-line focus:border-primary/50 focus:ring-4 focus:ring-primary/5'
              }`}
            />
          </div>

          <button onClick={handleVerify} className="primary-button w-full h-11">
            Verify & Confirm
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-2 text-muted">Or</span>
            </div>
          </div>

          <button
            onClick={() => {
              setInputCode(product.id);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white h-11 text-xs font-bold text-ink hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ScanLine className="h-4 w-4 text-primary" />
            Simulate Scan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerificationModal;
