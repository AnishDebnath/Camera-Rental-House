import { motion } from 'framer-motion';
import { CheckCheck, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency';

interface SuccessScreenProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  totalCost: number;
}

const SuccessScreen = ({ pickupDate, dropDate, totalCost }: SuccessScreenProps) => {
  return (
    <div className="page-animate app-shell flex min-h-[80vh] items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-lg w-full p-10 text-center"
      >
        {/* Animated Background Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-success/10 text-success border border-success/20 overflow-hidden">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCheck className="h-12 w-12" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
          />
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">Rent Confirmed!</h1>
        <p className="text-xs text-muted mb-8 leading-relaxed font-medium">
          Your high-end gear has been reserved. <br />
          Booking ID: <span className="font-bold text-primary tracking-wider uppercase">RH-{Math.floor(Math.random() * 10000)}</span>
        </p>

        <div className="space-y-4 rounded-[2rem] bg-white/50 backdrop-blur-md border border-white/60 shadow-sm p-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck className="h-20 w-20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Pickup Date</p>
              <p className="text-sm font-bold text-ink">{pickupDate ? format(pickupDate, 'MMM dd, yyyy') : 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Return Date</p>
              <p className="text-sm font-bold text-ink">{dropDate ? format(dropDate, 'MMM dd, yyyy') : 'N/A'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-line/50">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Amount Paid</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <Link to="/account?tab=active" className="secondary-button !rounded-2xl">Manage Order</Link>
          <Link to="/" className="primary-button !rounded-2xl">Return Home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;
