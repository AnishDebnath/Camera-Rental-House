import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import DatePicker from '../components/DatePicker';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import formatCurrency from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pickupDate, setPickupDate] = useState('2026-04-05');
  const [eventDate, setEventDate] = useState('2026-04-06');

  const totalDays = useMemo(() => {
    const start = new Date(pickupDate);
    const end = new Date(eventDate);
    const diff = Math.max((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1, 1);
    return Math.ceil(diff);
  }, [eventDate, pickupDate]);

  const totalCost = subtotal * totalDays;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    clearCart();
    setLoading(false);
    setComplete(true);
  };

  if (complete) {
    return (
      <div className="page-animate app-shell flex min-h-[70vh] items-center justify-center">
        <div className="card-surface max-w-lg space-y-5 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Rental confirmed</h1>
          <p className="text-sm text-muted">
            Booking ID <span className="font-semibold text-primary">RN-2048</span> is ready for pickup.
          </p>
          <div className="rounded-3xl bg-page p-4 text-left text-sm text-muted">
            Pickup: {formatDate(pickupDate)}<br />
            Event: {formatDate(eventDate)}<br />
            Estimated total: {formatCurrency(totalCost)}
          </div>
          <a href="/" className="primary-button w-full">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-animate app-shell space-y-6 pb-20">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-ink">Checkout</h1>
        <div className="grid grid-cols-3 gap-2">
          {['Details', 'Dates', 'Confirm'].map((label, index) => (
            <div key={label} className="space-y-2">
              <div className={`h-2 rounded-full ${index <= step ? 'bg-primary' : 'bg-line'}`} />
              <p className={`text-xs font-medium ${index <= step ? 'text-primary' : 'text-tertiary'}`}>{label}</p>
            </div>
          ))}
        </div>
      </header>

      {step === 0 ? (
        <section className="card-surface space-y-4 p-5">
          <h2 className="text-xl font-semibold text-ink">Your Details</h2>
          {[
            ['Name', user.fullName],
            ['Phone', user.phone],
            ['Email', user.email],
            ['Aadhaar', `xxxx-${String(user.aadhaarNo).slice(-4)}`],
            ['Voter Card', user.voterNo],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-page px-4 py-3">
              <p className="text-xs text-tertiary">{label}</p>
              <p className="text-sm font-medium text-ink">{value}</p>
            </div>
          ))}
          <LoadingButton type="button" onClick={() => setStep(1)}>Next</LoadingButton>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="card-surface space-y-4 p-5">
          <h2 className="text-xl font-semibold text-ink">Select Dates</h2>
          <DatePicker label="Pickup Date" value={pickupDate} onChange={setPickupDate} />
          <DatePicker label="Event Date" value={eventDate} onChange={setEventDate} min={pickupDate} />
          <div className="flex flex-wrap gap-3">
            <span className="rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">Pickup {formatDate(pickupDate)}</span>
            <span className="rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">Event {formatDate(eventDate)}</span>
          </div>
          <LoadingButton type="button" onClick={() => setStep(2)}>Next</LoadingButton>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          <div className="card-surface space-y-4 p-5">
            <h2 className="text-xl font-semibold text-ink">Confirm Order</h2>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-page p-3">
                <img src={item.images?.[0]?.image_url} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{formatCurrency(item.price_per_day)} / day</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-surface space-y-4 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Rental days</span>
              <span className="font-semibold text-ink">{totalDays}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Estimated total</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(totalCost)}</span>
            </div>
            <LoadingButton loading={loading} onClick={handleConfirm}>Confirm Rent</LoadingButton>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Checkout;
