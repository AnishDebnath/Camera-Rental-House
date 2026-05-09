import { useMemo, useState } from 'react';
import { User, Calendar as CalendarIcon, ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { differenceInDays } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';

import CheckoutHeader from './CheckoutHeader';
import UserDetailsStep from './UserDetailsStep';
import RentalPeriodStep from './RentalPeriodStep';
import OrderSummaryStep from './OrderSummaryStep';
import SuccessScreen from './SuccessScreen';

const STEPS = [
  { id: 'details', label: 'User Details', Icon: User },
  { id: 'dates', label: 'Rental Period', Icon: CalendarIcon },
  { id: 'summary', label: 'Order Summary', Icon: ShoppingBag },
];
const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { addToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  // Dates
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropDate, setDropDate] = useState<Date | null>(null);

  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [rentalNo, setRentalNo] = useState<string>('');

  const totalDays = useMemo(() => {
    if (!pickupDate || !dropDate) return 1;
    const diff = differenceInDays(dropDate, pickupDate) + 1;
    return Math.max(diff, 1);
  }, [pickupDate, dropDate]);

  const totalCost = subtotal * totalDays;

  const handleDateClick = (date: Date) => {
    if (!pickupDate || (pickupDate && dropDate)) {
      setPickupDate(date);
      setDropDate(null);
    } else if (pickupDate && !dropDate) {
      if (date < pickupDate) {
        setPickupDate(date);
        setDropDate(null);
      } else {
        setDropDate(date);
      }
    }
  };

  const handleConfirm = async () => {
    if (!pickupDate || !dropDate) {
      addToast({ title: 'Select Dates', message: 'Please select pickup and return dates.', tone: 'warning' });
      return;
    }
    
    setLoading(true);
    setFinalTotal(totalCost);
    
    try {
      const { data } = await axiosInstance.post('/rentals', {
        pickupDate: pickupDate.toISOString(),
        eventDate: dropDate.toISOString(),
        items: items.map(item => ({
          productId: item.id,
          quantity: 1
        }))
      });
      
      setRentalNo(data.rental_no);
      addToast({ title: 'Success', message: 'Gear reserved successfully!', tone: 'success' });
      clearCart();
      setComplete(true);
    } catch (err: any) {
      console.error('Failed to create rental:', err);
      addToast({ 
        title: 'Booking Failed', 
        message: err.message || 'Unable to connect to vault. Please try again.', 
        tone: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (complete) {
    return (
      <SuccessScreen
        pickupDate={pickupDate}
        dropDate={dropDate}
        totalCost={finalTotal}
        rentalNo={rentalNo}
      />
    );
  }

  return (
    <div className="page-animate app-shell space-y-8 pt-2">
      <CheckoutHeader
        steps={STEPS}
        currentStep={step}
        onStepClick={setStep}
      />

      <main className="w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <UserDetailsStep
              key="step0"
              user={user}
              onNext={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <RentalPeriodStep
              key="step1"
              pickupDate={pickupDate}
              dropDate={dropDate}
              onDateClick={handleDateClick}
              onPrev={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              {!user.isVerified && (
                <div className="rounded-2xl bg-warning/5 border border-warning/20 p-5 flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-warning shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-ink">Verification Pending</p>
                    <p className="text-xs font-medium text-muted leading-relaxed">
                      Your account is currently under review by our team. You can browse and add items to your cart, but you'll be able to confirm rentals once your account is verified.
                    </p>
                  </div>
                </div>
              )}
              <OrderSummaryStep
                key="step2"
                items={items}
                totalDays={totalDays}
                subtotal={subtotal}
                totalCost={totalCost}
                loading={loading}
                onPrev={() => setStep(1)}
                onConfirm={handleConfirm}
                disabled={!user.isVerified}
              />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Checkout;
