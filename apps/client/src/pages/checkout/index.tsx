import { useMemo, useState } from 'react';
import { User, Calendar as CalendarIcon, ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { differenceInDays } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';

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
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  // Dates
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropDate, setDropDate] = useState<Date | null>(null);

  const [finalTotal, setFinalTotal] = useState<number>(0);

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
    setLoading(true);
    // Capture the final total before clearing the cart
    setFinalTotal(totalCost);
    
    // Simulate API call
    await new Promise((resolve) => window.setTimeout(resolve, 2000));
    clearCart();
    setLoading(false);
    setComplete(true);
  };

  if (!user) return null;

  if (complete) {
    return (
      <SuccessScreen
        pickupDate={pickupDate}
        dropDate={dropDate}
        totalCost={finalTotal}
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
            <OrderSummaryStep
              key="step2"
              items={items}
              totalDays={totalDays}
              subtotal={subtotal}
              totalCost={totalCost}
              loading={loading}
              onPrev={() => setStep(1)}
              onConfirm={handleConfirm}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Checkout;
