import { Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react';
import { useToast } from '../../../store/ToastContext';
import logo from '../../../assets/logo.png';

const Footer = () => {
  const { addToast } = useToast();

  return (
    <footer className="app-shell">
      <div className="card-surface px-6 py-8">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Camera Rental House"
                className="h-11 w-auto object-contain origin-left"
              />
            </div>
            <p className="max-w-md text-sm text-muted">
              Modern rentals for production teams, creator studios, and event
              shooters who need verified availability and a faster counter
              workflow.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <button
                type="button"
                onClick={() =>
                  addToast({
                    title: 'Demo contact',
                    message: 'Phone action would dial the rental house.',
                    tone: 'info',
                  })
                }
                className="inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-primary" /> +91 98765 43210
              </button>
              <button
                type="button"
                onClick={() =>
                  addToast({
                    title: 'Demo contact',
                    message: 'Email action would open your mail app.',
                    tone: 'info',
                  })
                }
                className="inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-primary" /> hello@camerarentalhouse.in
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Follow</h3>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, name: 'Instagram' },
                { Icon: Facebook, name: 'Facebook' },
                { Icon: Youtube, name: 'Youtube' },
              ].map(({ Icon, name }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    addToast({
                      title: 'Demo social action',
                      message: `${name} would open from the live website.`,
                      tone: 'info',
                    })
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-page text-primary"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-line pt-4 text-xs text-tertiary">
          2026 Camera Rental House.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
