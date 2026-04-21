import { motion } from 'framer-motion';
import { User, Phone, Mail, CreditCard, ShieldCheck } from 'lucide-react';
import LoadingButton from '../../components/LoadingButton';

interface UserDetailsStepProps {
  user: any;
  onNext: () => void;
}

const UserDetailsStep = ({ user, onNext }: UserDetailsStepProps) => {
  const fields = [
    { label: 'Full Name', value: user.fullName, Icon: User },
    { label: 'Phone Number', value: user.phone, Icon: Phone },
    { label: 'Email Address', value: user.email, Icon: Mail },
    { label: 'Aadhaar ID', value: user.aadhaarNo ? `•••• •••• ${String(user.aadhaarNo).slice(-4)}` : 'Not provided', Icon: CreditCard },
    { label: 'Voter ID', value: user.voterNo || 'Not provided', Icon: ShieldCheck },
  ];

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
            <h2 className="text-lg font-bold tracking-tight text-ink">Personal Profile</h2>
            <p className="text-xs text-muted font-medium">Verify your registered identification details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label} className="group relative overflow-hidden rounded-[1.2rem] border border-white bg-white/60 p-4 transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-line text-muted group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  <field.Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{field.label}</p>
                  <p className="text-sm font-semibold text-ink">{field.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          <LoadingButton onClick={onNext} className="!rounded-2xl">Continue to Dates</LoadingButton>
        </div>
      </div>
    </motion.section>
  );
};

export default UserDetailsStep;
