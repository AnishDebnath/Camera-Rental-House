import { Camera, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await login(form);
    setLoading(false);
    navigate(location.state?.from || '/account');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-8">
      <div className="w-full max-w-md rounded-[32px] border border-line bg-white p-6 shadow-card md:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-light text-primary">
            <Camera className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted">Demo login for the CineKit client flow.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Email or phone number</span>
            <div className="input-shell">
              <input
                value={form.identifier}
                onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))}
                className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                placeholder="alex@example.com"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Password</span>
            <div className="input-shell">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-tertiary" /> : <Eye className="h-4 w-4 text-tertiary" />}
              </button>
            </div>
          </label>

          <LoadingButton loading={loading} type="submit">
            Login
          </LoadingButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New to CineKit?{' '}
          <Link to="/signup" className="font-semibold text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
