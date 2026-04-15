import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

// crypto.randomUUID() requires a secure context (HTTPS or localhost).
// When accessed over plain HTTP on a local network, it is undefined.
// This helper falls back to a Math.random-based RFC-4122 v4 UUID.
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Polyfill: RFC-4122 v4 UUID via Math.random
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, message, tone = 'info' }) => {
    const id = generateId();
    setToasts((current) => [...current, { id, title, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 2800);
  };

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast: (id) =>
        setToasts((current) => current.filter((item) => item.id !== id)),
    }),
    [toasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
