import { UserRound, Pencil, X, IdCard, ExternalLink, User as UserIcon, Phone, Mail, Facebook, Instagram, Youtube, Hash } from 'lucide-react';
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
  const sections = [
    {
      title: 'Personal Information',
      icon: UserRound,
      fields: [
        ['Full name', 'fullName', 'text', UserIcon],
        ['Phone Number', 'phone', 'tel', Phone],
        ['Email Address', 'email', 'email', Mail],
      ]
    },
    {
      title: 'Identity Verification',
      icon: IdCard,
      fields: [
        ['Aadhaar Number', 'aadhaarNo', 'text'],
        ['Voter ID', 'voterNo', 'text'],
      ]
    },
    {
      title: 'Social Connections',
      icon: ExternalLink,
      fields: [
        ['Facebook Profile', 'facebook', 'url', Facebook],
        ['Instagram Profile', 'instagram', 'url', Instagram],
        ['YouTube Channel', 'youtube', 'url', Youtube],
      ]
    }
  ] as const;

  return (
    <section className="animate-fade-up">
      <div className="rounded-[2.5rem] border border-white bg-white/50 p-5 backdrop-blur-2xl md:p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
              Profile Settings
            </h2>
            <p className="text-xs font-medium text-muted/80 md:text-sm">
              Manage your personal information and verified documents.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSetEditing((c: any) => !c)}
            className={`flex h-[2.75rem] items-center justify-center rounded-xl px-6 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 shadow-sm ${
              editing 
                ? 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20' 
                : 'bg-white text-ink hover:text-primary hover:shadow-md border border-white/60'
            }`}
          >
            {editing ? (
              <><X className="mr-2 h-4 w-4" /> Cancel Edit</>
            ) : (
              <><Pencil className="mr-2 h-3.5 w-3.5" /> Edit Profile</>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-12 pt-4">
          {sections.map((section, index) => (
            <div 
              key={section.title} 
              className="flex flex-col gap-5"
            >
              {/* Top Row: Context */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[0.8rem] bg-white text-primary shadow-sm border border-black/5">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-ink">{section.title}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed text-muted/70">
                  {index === 0 ? "Update your fundamental contact details and name." 
                   : index === 1 ? "Ensure your identity documents are accurate." 
                   : "Link your profiles to build trust within the community."}
                </p>
              </div>
              
              {/* Downside Details: Fields */}
              <div className="w-full pt-1">
                {section.title === 'Identity Verification' ? (
                  <div className="grid gap-5 xl:grid-cols-2">
                    {['aadhaarNo', 'voterNo'].map((key) => {
                      const label = key === 'aadhaarNo' ? 'Aadhaar Card' : 'Voter ID';
                      const docUrl = key === 'aadhaarNo' ? draft.aadhaarDocUrl : draft.voterDocUrl;
                      const value = (draft as any)[key] || '';
                      
                      return (
                      <div key={key} className="flex flex-col bg-white/60 rounded-[1.2rem] border border-white shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-5 pt-5 pb-1">
                            <h4 className="text-sm font-bold text-ink">{label}</h4>
                            <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest px-2 py-0.5 rounded border border-black/5 bg-white">Document</span>
                          </div>

                          <div className="px-5 pb-5 pt-3 flex flex-col gap-5">
                            <div className="w-full space-y-1.5">
                              <div className="flex items-center gap-1.5 ml-1">
                                <Hash className="h-3 w-3 text-tertiary" />
                                <label className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                                  Document Number
                                </label>
                              </div>
                              <div className={`h-11 overflow-hidden rounded-xl transition-all shadow-sm flex items-center px-4 border ${
                                editing ? 'bg-white border-black/15 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10' : 'bg-white/40 border-black/5 opacity-90'
                              }`}>
                                <input
                                  disabled={!editing}
                                  type="text"
                                  value={value}
                                  onChange={(e) => onDraftChange(key, e.target.value)}
                                  className={`w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 ${
                                     editing ? 'text-ink placeholder:text-muted/40' : 'text-ink/90 cursor-default'
                                  }`}
                                  placeholder={editing ? "Enter number" : "Not provided"}
                                />
                              </div>
                            </div>
                            
                            <div className="w-full">
                              <p className="mb-1.5 text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase ml-1">Digital Copy</p>
                              <div className="group/img relative w-full overflow-hidden rounded-xl border-2 border-white shadow-sm bg-slate-50">
                                {docUrl ? (
                                  <img 
                                    src={docUrl} 
                                    alt={label} 
                                    className="w-full h-auto object-contain"
                                  />
                                ) : (
                                  <div className="flex aspect-[1.6/1] w-full flex-col items-center justify-center gap-2 text-slate-300">
                                    <IdCard className="h-6 w-6 opacity-40" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">No File</span>
                                  </div>
                                )}
                                
                                {editing && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all group-hover/img:opacity-100">
                                    <button className="flex text-[10px] uppercase tracking-widest font-bold text-ink shadow-sm items-center gap-1.5 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors">
                                      <Pencil className="h-3 w-3" /> Update
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-white/60 p-5 rounded-[1.2rem] border border-white shadow-sm">
                    {section.fields.map((field) => {
                      const [label, key, type, Icon] = field as any;
                      const value = (draft as any)?.[key] || '';
                      return (
                        <div key={key} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 ml-1">
                            {Icon && <Icon className="h-3 w-3 text-tertiary" />}
                            <label className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                              {label as string}
                            </label>
                          </div>
                          <div className={`h-11 overflow-hidden rounded-xl transition-all shadow-sm flex items-center px-4 border ${
                            editing ? 'bg-white border-black/15 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10' : 'bg-white/40 border-black/5 opacity-90'
                          }`}>
                            <input
                              disabled={!editing}
                              type={type}
                              value={value}
                              onChange={(e) => onDraftChange(key, e.target.value)}
                              className={`w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 ${
                                 editing ? 'text-ink placeholder:text-muted/40' : 'text-ink/90 cursor-default'
                              }`}
                              placeholder={editing ? `Add ${label.toLowerCase()}` : 'Not provided'}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex pt-4 mt-2 border-t border-black/5">
            <LoadingButton
              loading={loading}
              onClick={onSave}
              className="!h-12 !min-h-0 w-full rounded-xl text-xs md:text-sm font-bold sm:w-fit sm:px-12 shadow-sm"
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
