const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const browserOrigin = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }

  return `${window.location.protocol}//${window.location.hostname}`;
};

const isLocalDevelopment = () =>
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const resolveAppUrl = (
  envValue: string | undefined,
  fallbackPort: number,
  productionPath = '',
) => {
  const configured = envValue?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }

  return isLocalDevelopment()
    ? `${browserOrigin()}:${fallbackPort}`
    : `${browserOrigin()}${productionPath}`;
};

export const resolveAuthAppUrl = (envValue?: string) => resolveAppUrl(envValue, 5173);

export const resolveAdminAppUrl = (envValue?: string) =>
  resolveAppUrl(envValue, 5174, '/admin');

export const resolveClientAppUrl = (envValue?: string) => resolveAppUrl(envValue, 5173);
