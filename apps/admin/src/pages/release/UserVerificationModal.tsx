import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine, UserCheck, ShieldCheck, Phone } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  user: {
    id: string;
    name: string;
    image: string;
    phone: string;
  };
  onClose: () => void;
  onVerify: () => void;
}

const UserVerificationModal = ({ user, onClose, onVerify }: Props) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [manualId, setManualId] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'user-qr-reader';

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
    try {
      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText) => {
          if (decodedText.toLowerCase() === user.id.toLowerCase()) {
            handleSuccess();
          }
        },
        undefined
      );
    } catch (err) {
      console.error('Start error:', err);
    }
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.toLowerCase() === user.id.toLowerCase()) {
      handleSuccess();
    } else {
      setStatus('error');
      setTimeout(() => setStatus('scanning'), 2000);
    }
  };

  const handleSuccess = () => {
    setStatus('success');
    stopScanner();
    setTimeout(() => {
      onVerify();
      onClose();
    }, 1500);
  };

  useEffect(() => {
    startScanning();
    return () => { stopScanner(); };
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
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-black text-ink text-xs uppercase tracking-widest">Verify Identity</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card Mini */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-line p-3 bg-slate-50/50">
          <img src={user.image} className="h-10 w-10 rounded-xl object-cover border border-line" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-blue-500 fill-blue-500/10" />
              <p className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest mt-0.5">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Manual Input */}
        <form onSubmit={handleManualVerify} className="mb-6">
          <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 px-1">
            Manual ID Entry
          </label>
          <div className="relative group">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter User ID..."
              className="w-full h-11 rounded-xl border-line bg-slate-50 px-4 text-sm font-bold text-ink placeholder:text-muted/40 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 h-8 rounded-lg bg-ink px-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-900 active:scale-95 transition-all"
            >
              Verify
            </button>
          </div>
        </form>

        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em] text-muted"><span className="bg-white px-4">OR SCAN QR</span></div>
        </div>

        {/* Camera Area */}
        <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl border-2 border-line bg-ink shadow-inner">
          <div id={containerId} className="absolute inset-0 h-full w-full" />

          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-48 w-48">
                    <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-black rounded-tl-xl" />
                    <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-black rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-black rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-black rounded-br-xl" />
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/90 backdrop-blur-md">
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl"><ShieldCheck className="h-10 w-10 text-emerald-500" /></div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Verified</p>
                <p className="mt-2 text-[10px] font-bold text-emerald-50 uppercase tracking-widest opacity-80">Identity Confirmed</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 backdrop-blur-md">
                <div className="mb-4 rounded-full bg-white p-5 shadow-2xl"><X className="h-10 w-10 text-rose-500" /></div>
                <p className="text-base font-black text-white uppercase tracking-[0.25em]">Mismatch</p>
                <p className="mt-2 text-[10px] font-bold text-rose-50 uppercase tracking-widest opacity-80">Invalid User ID</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-[9px] font-black text-muted uppercase tracking-[0.2em] animate-pulse">
          Awaiting input or scan...
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UserVerificationModal;
