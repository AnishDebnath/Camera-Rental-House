import { motion } from 'framer-motion';
import CustomCalendar from '../../components/CustomCalendar';
import LoadingButton from '../../components/LoadingButton';

interface RentalPeriodStepProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

const RentalPeriodStep = ({ pickupDate, dropDate, onDateClick, onPrev, onNext }: RentalPeriodStepProps) => {
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/50 p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Rental Duration</h2>
            <p className="text-xs text-muted font-medium">Select your pickup and return milestones.</p>
          </div>
        </div>

        <CustomCalendar
          pickupDate={pickupDate}
          dropDate={dropDate}
          onDateClick={onDateClick}
        />

        <div className="mt-10 flex gap-4">
          <button
            onClick={onPrev}
            className="secondary-button !w-1/3 !rounded-2xl"
          >
            Go Back
          </button>
          <LoadingButton
            disabled={!pickupDate || !dropDate}
            onClick={onNext}
            className="!rounded-2xl"
          >
            Confirm Order Summary
          </LoadingButton>
        </div>
      </div>
    </motion.section>
  );
};

export default RentalPeriodStep;
