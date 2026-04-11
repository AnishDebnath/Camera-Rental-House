import { Camera, Eye, EyeOff, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '../components/LoadingButton';
import { findDemoAdminAccount, startDemoUserSession } from '../../../../packages/auth';
import {
  resolveAdminAppUrl,
  resolveClientAppUrl,
} from '../../../../packages/auth/appUrls';

const adminAppUrl = resolveAdminAppUrl(import.meta.env.VITE_ADMIN_APP_URL);
const clientAppUrl = resolveClientAppUrl(import.meta.env.VITE_CLIENT_APP_URL);
const resolveClientNextPath = (requestedNext: string | null) =>
  requestedNext?.startsWith('/') && !requestedNext.startsWith('/admin')
    ? requestedNext
    : '/account';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: '', password: '' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const currentParams = new URLSearchParams(window.location.search);
    const requestedNext = currentParams.get('next');

    const matched = findDemoAdminAccount(form.identifier, form.password);

    if (matched) {
      const nextPath =
        requestedNext && requestedNext.startsWith('/admin')
          ? requestedNext
          : matched.role === 'manager'
            ? '/admin/rentals'
            : '/admin';
      const params = new URLSearchParams({
        token: `demo-${matched.role}-token`,
        role: matched.role,
        next: nextPath,
      });
      window.location.replace(`${adminAppUrl}/auth-redirect?${params.toString()}`);
      return;
    }

    startDemoUserSession();
    window.location.replace(`${clientAppUrl}${resolveClientNextPath(requestedNext)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] relative group">
        {/* Modern Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 rounded-[40px] blur-xl opacity-50 transition duration-1000" />

        <div className="relative rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
          {/* Refined Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-100 text-slate-500 hover:text-primary shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all active:scale-90 z-10"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          {/* Decorative Corner Gradient */}
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 blur-[60px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-primary/5 blur-[50px] rounded-full" />

          <div className="relative mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-lg ring-1 ring-black/[0.05]">
              <Camera className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-ink leading-tight">Welcome Back</h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Ready to create your next masterpiece? Sign in to access your gear.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Email or Phone Number
              </label>
              <div className="relative">
                <input
                  required
                  value={form.identifier}
                  onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 placeholder:text-slate-400 text-sm"
                  placeholder="Enter your email or phone number"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Password
                </label>
                {/* <Link to="/forgot-password" title="Coming soon!" className="text-[12px] font-medium text-primary hover:underline">
                  Forgot password?
                </Link> */}
              </div>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full h-11 pl-4 pr-11 rounded-xl bg-white/50 border border-slate-200 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 placeholder:text-slate-400 text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <LoadingButton
                loading={loading}
                type="submit"
                className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all"
              >
                Sign In
              </LoadingButton>
            </div>
          </form>

          {/* Social / Divider (Visual only) */}
          {/* <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">demo access</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[12px] text-slate-500 leading-relaxed text-center italic">
              Use <b className="text-slate-700">admin / admin123</b> for the dashboard or just click Sign In for the store.
            </p>
          </div> */}

          <div className="mt-6 pt-5 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-px bg-slate-200" />
            <p className="text-sm text-slate-500">
              New here?{' '}
              <Link to="/signup" className="font-bold text-primary inline-flex items-center gap-1 hover:underline group/sign">
                Create Account
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/sign:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
