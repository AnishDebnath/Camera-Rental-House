import { ArrowLeft, Eye, EyeOff, Upload, User, Phone, Mail, Lock, Camera, ArrowRight, ShieldCheck, Share2, IdCard, Facebook, Instagram, Youtube, FileText, Image } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LoadingButton from '../components/LoadingButton';
import clsx from 'clsx';

type UploadKey = 'aadhaarDoc' | 'voterDoc';

type UploadFile = {
  file: File;
  preview: string;
};

const signupFields = [
  { key: 'fullName', label: 'Full name', placeholder: 'Alex Director', icon: User },
  { key: 'phone', label: 'Phone number', placeholder: '9876543210', icon: Phone },
  { key: 'email', label: 'Email address', placeholder: 'alex@example.org', icon: Mail },
] as const;

const socialFields = [
  { key: 'facebook', label: 'Facebook URL', icon: Facebook },
  { key: 'instagram', label: 'Instagram Handle', icon: Instagram },
  { key: 'youtube', label: 'YouTube Channel', icon: Youtube },
] as const;

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaarNo: '',
    voterNo: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });

  const [files, setFiles] = useState<Record<UploadKey, UploadFile | null>>({
    aadhaarDoc: null,
    voterDoc: null,
  });

  const storageRefAadhaar = useRef<HTMLInputElement>(null);
  const cameraRefAadhaar = useRef<HTMLInputElement>(null);
  const storageRefVoter = useRef<HTMLInputElement>(null);
  const cameraRefVoter = useRef<HTMLInputElement>(null);

  const handleFile = (key: UploadKey, file?: File) => {
    if (file) {
      setFiles((current) => ({
        ...current,
        [key]: { file, preview: URL.createObjectURL(file) }
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setLoading(false);
    const next = new URLSearchParams(location.search).get('next');
    navigate(next?.startsWith('/') ? `/login?next=${encodeURIComponent(next)}` : '/login');
  };

  const titleForStep = ["Personal Info", "Identity Verification", "Social Connection"];
  const iconForStep = [User, ShieldCheck, Share2];
  const ActiveIcon = iconForStep[step];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[500px] relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 rounded-[40px] blur-xl opacity-50 transition duration-1000" />

        <div className="relative rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => (step ? setStep((current) => current - 1) : navigate(-1))}
            className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-100 text-slate-500 hover:text-primary shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all active:scale-90 z-10"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <div className="absolute top-8 right-8 flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className={clsx("h-1.5 rounded-full transition-all duration-300", idx === step ? "w-6 bg-primary" : "w-1.5 bg-slate-200")} />
            ))}
          </div>

          <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 blur-[60px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-primary/5 blur-[50px] rounded-full" />

          <div className="relative mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-lg ring-1 ring-black/[0.05]">
              <ActiveIcon className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-ink leading-tight">Create Account</h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">Step {step + 1}: {titleForStep[step]}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 0 && (
              <div className="space-y-4">
                {signupFields.map(({ key, label, placeholder, icon: Icon }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </label>
                    <div className="relative">
                      {key === 'phone' && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 border-r border-slate-100 pr-3 mr-3">+91</div>
                      )}
                      <input
                        required
                        value={form[key]}
                        onChange={(e) => setForm((curr) => ({ ...curr, [key]: e.target.value }))}
                        className={clsx("w-full h-11 px-4 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 placeholder:text-slate-400 text-sm", key === 'phone' ? "pl-[72px]" : "")}
                        placeholder={placeholder}
                      />
                    </div>
                  </div>
                ))}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm((curr) => ({ ...curr, password: e.target.value }))}
                        className="w-full h-11 pl-4 pr-11 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-sm"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => setForm((curr) => ({ ...curr, confirmPassword: e.target.value }))}
                        className="w-full h-11 pl-4 pr-11 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-sm"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <LoadingButton type="button" onClick={() => setStep(1)} className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all">Next Step</LoadingButton>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                {/* Aadhaar Section */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><IdCard className="h-3.5 w-3.5" />Aadhaar number</label>
                    <input required value={form.aadhaarNo} onChange={(e) => setForm((curr) => ({ ...curr, aadhaarNo: e.target.value }))} className="w-full h-11 px-4 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-sm" placeholder="XXXX-XXXX-XXXX" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><FileText className="h-3.5 w-3.5" />Aadhaar photocopy</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => storageRefAadhaar.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", files.aadhaarDoc && "border-primary text-primary bg-primary/5")}>
                        <Image className="h-4 w-4" /> From Storage
                      </button>
                      <button type="button" onClick={() => cameraRefAadhaar.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", files.aadhaarDoc && "border-primary text-primary bg-primary/5")}>
                        <Camera className="h-4 w-4" /> Take Photo
                      </button>
                    </div>
                    {files.aadhaarDoc && (
                      <div className="relative mt-2 rounded-2xl overflow-hidden aspect-[3/4] border border-slate-100 shadow-sm transition-all animate-in fade-in zoom-in duration-300">
                        <img src={files.aadhaarDoc.preview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => setFiles({ ...files, aadhaarDoc: null })} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center text-sm shadow-lg hover:bg-black/70 transition-colors">✕</button>
                      </div>
                    )}
                    <input ref={storageRefAadhaar} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile('aadhaarDoc', e.target.files?.[0])} />
                    <input ref={cameraRefAadhaar} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile('aadhaarDoc', e.target.files?.[0])} />
                  </div>
                </div>

                {/* Voter Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100/50">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><IdCard className="h-3.5 w-3.5" />Voter Card number</label>
                    <input required value={form.voterNo} onChange={(e) => setForm((curr) => ({ ...curr, voterNo: e.target.value }))} className="w-full h-11 px-4 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-sm" placeholder="Enter Voter ID" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><FileText className="h-3.5 w-3.5" />Voter card photocopy</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => storageRefVoter.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", files.voterDoc && "border-primary text-primary bg-primary/5")}>
                        <Image className="h-4 w-4" /> From Storage
                      </button>
                      <button type="button" onClick={() => cameraRefVoter.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", files.voterDoc && "border-primary text-primary bg-primary/5")}>
                        <Camera className="h-4 w-4" /> Take Photo
                      </button>
                    </div>
                    {files.voterDoc && (
                      <div className="relative mt-2 rounded-2xl overflow-hidden aspect-[3/4] border border-slate-100 shadow-sm transition-all animate-in fade-in zoom-in duration-300">
                        <img src={files.voterDoc.preview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => setFiles({ ...files, voterDoc: null })} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center text-sm shadow-lg hover:bg-black/70 transition-colors">✕</button>
                      </div>
                    )}
                    <input ref={storageRefVoter} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile('voterDoc', e.target.files?.[0])} />
                    <input ref={cameraRefVoter} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile('voterDoc', e.target.files?.[0])} />
                  </div>
                </div>

                <div className="pt-2">
                  <LoadingButton type="button" onClick={() => setStep(2)} className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all">Almost Done</LoadingButton>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {socialFields.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><Icon className="h-3.5 w-3.5" />{label}</label>
                    <input value={form[key]} onChange={(e) => setForm((curr) => ({ ...curr, [key]: e.target.value }))} className="w-full h-11 px-4 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-sm" placeholder={`Enter ${label.split(' ')[0]} URL`} />
                  </div>
                ))}
                <div className="pt-2">
                  <LoadingButton type="submit" loading={loading} className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all">Complete Signup</LoadingButton>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 pt-5 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-px bg-slate-200" />
            <p className="text-sm text-slate-500">Already have an account?<br /><Link to="/login" className="font-bold text-primary inline-flex items-center gap-1 hover:underline group/sign">Login here <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/sign:translate-x-1" /></Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
