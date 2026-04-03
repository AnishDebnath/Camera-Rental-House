const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const browserOrigin = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }

  return `${window.location.protocol}//${window.location.hostname}`;
};

const configuredAuthAppUrl = import.meta.env.VITE_AUTH_APP_URL?.trim();
const isLocalDevelopment =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const useExternalAuthApp = true;

export const authAppUrl = configuredAuthAppUrl
  ? trimTrailingSlash(configuredAuthAppUrl)
  : isLocalDevelopment
    ? `${browserOrigin()}:5175`
    : `${browserOrigin()}/auth`;
