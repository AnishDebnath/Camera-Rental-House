import { ArrowLeft, Eye, EyeOff, Upload } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../context/AuthContext';

type UploadKey = 'aadhaarDoc' | 'voterDoc';

type UploadFile = {
  file: File;
  preview: string;
};

const identityFields = [
  { key: 'aadhaarDoc', label: 'Aadhaar photocopy' },
  { key: 'voterDoc', label: 'Voter card photocopy' },
] as const satisfies ReadonlyArray<{ key: UploadKey; label: string }>;

const signupFields = [
  { key: 'fullName', label: 'Full name', placeholder: 'Alex Director' },
  { key: 'phone', label: 'Phone number', placeholder: '9876543210' },
  { key: 'email', label: 'Email address', placeholder: 'alex@example.com' },
] as const;

const socialFields = [
  { key: 'facebook', label: 'Facebook profile URL' },
  { key: 'instagram', label: 'Instagram handle' },
  { key: 'youtube', label: 'YouTube channel URL' },
] as const;

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
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
  const aadhaarRef = useRef<HTMLInputElement>(null);
  const voterRef = useRef<HTMLInputElement>(null);

  const fileInputRefs: Record<UploadKey, typeof aadhaarRef> = {
    aadhaarDoc: aadhaarRef,
    voterDoc: voterRef,
  };

  const handleFile = (key: UploadKey, file?: File) => {
    setFiles((current) => ({
      ...current,
      [key]: file ? { file, preview: URL.createObjectURL(file) } : null,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await signup(form);
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-page px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex items-center justify-between">
          <button type="button" onClick={() => (step ? setStep((current) => current - 1) : navigate(-1))} className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-ink">Step {step + 1} of 3</p>
            <p className="text-xs text-muted">Demo signup flow</p>
          </div>
          <div className="w-11" />
        </header>

        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <div key={index} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-primary' : 'bg-line'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
          {step === 0 ? (
            <>
              {signupFields.map(({ key, label, placeholder }) => (
                <label key={key} className="space-y-2">
                  <span className="text-sm font-medium text-ink">{label}</span>
                  <div className="input-shell">
                    {key === 'phone' ? <span className="text-sm font-medium text-muted">+91</span> : null}
                    <input
                      value={form[key]}
                      onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                      placeholder={placeholder}
                      className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                    />
                  </div>
                </label>
              ))}

              <label className="space-y-2">
                <span className="text-sm font-medium text-ink">Password</span>
                <div className="input-shell">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                  />
                  <button type="button" onClick={() => setShowPassword((current) => !current)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-tertiary" /> : <Eye className="h-4 w-4 text-tertiary" />}
                  </button>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-ink">Confirm password</span>
                <div className="input-shell">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((current) => !current)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-tertiary" /> : <Eye className="h-4 w-4 text-tertiary" />}
                  </button>
                </div>
              </label>

              <LoadingButton type="button" onClick={() => setStep(1)}>
                Next
              </LoadingButton>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink">Aadhaar number</span>
                <div className="input-shell">
                  <input value={form.aadhaarNo} onChange={(event) => setForm((current) => ({ ...current, aadhaarNo: event.target.value }))} className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0" />
                </div>
              </label>
              {identityFields.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <span className="text-sm font-medium text-ink">{label}</span>
                  <button type="button" onClick={() => fileInputRefs[key].current?.click()} className="flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-page text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-ink">Tap to upload or use camera</p>
                  </button>
                  <input ref={fileInputRefs[key]} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFile(key, event.target.files?.[0])} />
                  {files[key]?.preview ? <img src={files[key].preview} alt="" className="h-24 w-24 rounded-2xl object-cover" /> : null}
                </div>
              ))}
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink">Voter Card number</span>
                <div className="input-shell">
                  <input value={form.voterNo} onChange={(event) => setForm((current) => ({ ...current, voterNo: event.target.value }))} className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0" />
                </div>
              </label>
              <LoadingButton type="button" onClick={() => setStep(2)}>
                Next
              </LoadingButton>
            </>
          ) : null}

          {step === 2 ? (
            <>
              {socialFields.map(({ key, label }) => (
                <label key={key} className="space-y-2">
                  <span className="text-sm font-medium text-ink">{label}</span>
                  <div className="input-shell">
                    <input value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0" />
                  </div>
                </label>
              ))}
              <LoadingButton type="submit" loading={loading}>
                Submit
              </LoadingButton>
            </>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default Signup;
