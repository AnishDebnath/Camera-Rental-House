import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  product: any;
  onClose: () => void;
  onVerify: (id: string) => void;
}

const VerificationModal = ({ product, onClose, onVerify }: Props) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'timeout'>('scanning');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerId = 'qr-reader-container';

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Stop error:', err);
      }
    }
  };

  const startScanning = async () => {
    setStatus('scanning');

    // Clear timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Timeout logic
    timeoutRef.current = setTimeout(() => {
      setStatus(prev => {
        if (prev === 'scanning') {
          stopScanner();
          return 'timeout';
        }
        return prev;
      });
    }, 10000);

    try {
      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // Success Callback
          if (decodedText.toLowerCase() === product.id.toLowerCase()) {
            setStatus('success');
            stopScanner();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            setTimeout(() => {
              onVerify(product.id);
              onClose();
            }, 1500);
          }
        },
        undefined // Error callback (silent)
      );
    } catch (err) {
      console.error('Start error:', err);
      setStatus('timeout'); // Fallback if camera fails
    }
  };

  useEffect(() => {
    startScanning();

    return () => {
      stopScanner();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

        {/* Product Details */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-line p-3 bg-slate-50/50">
          <img
            src={product.image}
            className="h-12 w-12 rounded-lg object-cover border border-line shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{product.name}</p>
            <p className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest mt-0.5">
              Product Code: {product.id}
            </p>
          </div>
        </div>

        {/* Camera View Area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-line bg-ink shadow-inner">
          {/* HTML5 QR Code Container */}
          <div id={containerId} className="absolute inset-0 h-full w-full" />

          {/* Scanning Overlay */}
          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-10"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-64 w-64">
                    <div className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-black rounded-tl-xl" />
                    <div className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-black rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 h-10 w-10 border-b-4 border-l-4 border-black rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 h-10 w-10 border-b-4 border-r-4 border-black rounded-br-xl" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-500/90 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="mb-4 rounded-full bg-white p-5 shadow-2xl"
                >
                  <ScanLine className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Product Found</p>
                <p className="mt-2 text-[10px] font-bold text-emerald-50 uppercase tracking-widest opacity-80">
                  Product Verified
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeout / Error State */}
          <AnimatePresence>
            {status === 'timeout' && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-rose-500/90 backdrop-blur-md p-6 text-center"
              >
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl">
                  <X className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Scan Failed</p>
                <p className="mt-2 text-[10px] font-bold text-rose-50 uppercase tracking-widest opacity-80 leading-relaxed">
                  Could not detect QR code
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          {status === 'scanning' && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">
                Searching for product QR...
              </p>
            </>
          )}

          {status === 'timeout' && (
            <button
              onClick={startScanning}
              className="flex w-fit items-center justify-center gap-2 rounded-xl bg-ink h-10 px-6 text-xs font-black text-white hover:bg-slate-900 active:scale-95 transition-all shadow-lg"
            >
              <ScanLine className="h-4 w-4 text-white" />
              Try Again
            </button>
          )}

          {status === 'success' && (
            <div className="h-12" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerificationModal;
