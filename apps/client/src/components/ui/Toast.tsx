import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../store/ToastContext';

const ToastViewport = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[9999] flex flex-col gap-3 md:left-auto md:right-6 md:w-96">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="pointer-events-auto rounded-card border border-line bg-white px-4 py-3 shadow-card"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary-light p-2 text-primary">
                {toast.tone === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{toast.title}</p>
                <p className="mt-1 text-xs text-muted">{toast.message}</p>
              </div>
              <button type="button" onClick={() => removeToast(toast.id)}>
                <X className="h-4 w-4 text-tertiary" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
