const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const browserOrigin = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }

  return `${window.location.protocol}//${window.location.hostname}`;
};

const withFallbackOrigin = (envValue: string | undefined, fallbackPort: number) => {
  const configured = envValue?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }

  return `${browserOrigin()}:${fallbackPort}`;
};

export const authAppUrl = withFallbackOrigin(import.meta.env.VITE_AUTH_APP_URL, 5175);
