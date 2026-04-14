import { UserRound, Pencil } from 'lucide-react';
import LoadingButton from '../../components/LoadingButton';
import { User } from '../../store/AuthContext';

interface AccountDetailsTabProps {
  draft: User;
  editing: boolean;
  loading: boolean;
  onSetEditing: (val: any) => void;
  onDraftChange: (key: string, value: string) => void;
  onSave: () => void;
}

const AccountDetailsTab = ({ 
  draft, 
  editing, 
  loading, 
  onSetEditing, 
  onDraftChange, 
  onSave 
}: AccountDetailsTabProps) => {
  const fields = [
    ['Full name', 'fullName', 'text'],
    ['Phone Number', 'phone', 'tel'],
    ['Email Address', 'email', 'email'],
    ['Aadhaar Number', 'aadhaarNo', 'text'],
    ['Voter ID', 'voterNo', 'text'],
    ['Facebook Profile', 'facebook', 'url'],
    ['Instagram Profile', 'instagram', 'url'],
    ['YouTube Channel', 'youtube', 'url'],
  ] as const;

  return (
    <section className="animate-fade-up">
      <div className="card-surface rounded-[2rem] border border-white/60 bg-white/40 p-5 backdrop-blur-xl md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-1.5 text-lg md:text-xl font-bold text-ink">
              <UserRound className="h-5 w-5 text-primary" />
              Personal Information
            </h2>
            <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
              Manage your account details and contact information.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSetEditing((c: any) => !c)}
            className="secondary-button !h-10 !px-6 !text-xs md:!text-sm whitespace-nowrap bg-white/80"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {fields.map(([label, key, type]) => (
            <div key={key} className="group space-y-1.5">
              <label className="ml-1 text-[10px] md:text-xs font-bold tracking-widest text-tertiary transition-colors group-focus-within:text-primary uppercase">
                {label}
              </label>
              <div
                className={`input-shell !h-12 !min-h-0 border border-white/60 bg-white/50 backdrop-blur-sm transition-all duration-200 md:!h-13 ${!editing ? 'border-transparent bg-transparent opacity-80 shadow-none px-1' : ''
                  }`}
              >
                <input
                  disabled={!editing}
                  type={type}
                  value={(draft as any)?.[key] || ''}
                  onChange={(e) => onDraftChange(key, e.target.value)}
                  className="w-full border-0 bg-transparent p-0 text-xs md:text-sm font-bold text-ink placeholder:text-muted/50 focus:ring-0 disabled:text-ink"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex pt-2 md:pt-4">
            <LoadingButton
              loading={loading}
              onClick={onSave}
              className="!h-12 !min-h-0 w-full rounded-xl text-xs md:text-sm font-bold sm:w-fit sm:px-12"
            >
              Save Changes
            </LoadingButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccountDetailsTab;
