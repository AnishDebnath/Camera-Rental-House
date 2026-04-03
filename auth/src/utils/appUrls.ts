const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const browserOrigin = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }

  return `${window.location.protocol}//${window.location.hostname}`;
};

const withAppFallback = (
  envValue: string | undefined,
  fallbackPort: number,
  productionPath = '',
) => {
  const configured = envValue?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }

  return ['localhost', '127.0.0.1'].includes(typeof window !== 'undefined' ? window.location.hostname : '')
    ? `${browserOrigin()}:${fallbackPort}`
    : `${browserOrigin()}${productionPath}`;
};

export const clientAppUrl = withAppFallback(import.meta.env.VITE_CLIENT_APP_URL, 5173);
export const adminAppUrl = withAppFallback(import.meta.env.VITE_ADMIN_APP_URL, 5174, '/admin');
