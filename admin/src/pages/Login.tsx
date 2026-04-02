import { Camera, Eye, EyeOff } from 'lucide-react';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_CREDENTIALS, startDemoSession } from '../utils/demoAuth';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const matchedDemo = DEMO_CREDENTIALS.find(
        (item) =>
          item.username === form.username.trim() &&
          item.password === form.password,
      );

      if (!matchedDemo) {
        throw new Error('Use one of the demo credentials below.');
      }

      startDemoSession(matchedDemo.role);
      navigate(matchedDemo.role === 'manager' ? '/admin/rentals' : '/admin');
    } catch (error: any) {
      alert(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-[32px] border border-line bg-white p-6 shadow-card md:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-light text-primary">
            <Camera className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-ink">CineKit Admin</h1>
          <p className="mt-2 text-sm text-muted">
            Demo login for admin and manager access.
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {DEMO_CREDENTIALS.map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() =>
                setForm({
                  username: item.username,
                  password: item.password,
                })
              }
              className="w-full rounded-card border border-line bg-page px-4 py-3 text-left transition hover:border-primary/30 hover:bg-primary-light"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-1 text-xs text-muted">{item.description}</p>
                </div>
                <div className="text-right text-xs font-medium text-primary-dark">
                  <div>{item.username}</div>
                  <div>{item.password}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2 block">
            <span className="text-sm font-medium text-ink">Username</span>
            <div className="input-shell">
              <input
                value={form.username}
                onChange={handleInputChange('username')}
                className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                placeholder="admin"
              />
            </div>
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-medium text-ink">Password</span>
            <div className="input-shell">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange('password')}
                className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
                placeholder="1234"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-tertiary" /> : <Eye className="h-4 w-4 text-tertiary" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="primary-button w-full disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
