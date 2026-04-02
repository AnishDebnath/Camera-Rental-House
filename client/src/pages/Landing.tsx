import { useEffect, useState } from 'react';
import {
  Camera,
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Youtube,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryChips from '../components/CategoryChips';
import { categories, heroSlides, mockProducts } from '../data/mockProducts';
import { useToast } from '../context/ToastContext';

const Landing = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="page-animate space-y-10 pb-8 md:space-y-12">
      <section className="app-shell space-y-4">
        <div className="relative overflow-hidden rounded-[32px] bg-slate-900">
          <img
            src={heroSlides[activeSlide].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="relative flex min-h-[280px] flex-col justify-end gap-4 p-6 text-white md:min-h-[380px] md:p-8">
            <span className="w-fit rounded-pill bg-primary/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              CineKit rental house
            </span>
            <div className="max-w-xl space-y-3">
              <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="text-sm text-slate-100 md:text-base">
                {heroSlides[activeSlide].copy}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/browse')}
                className="primary-button w-fit"
              >
                {heroSlides[activeSlide].cta}
              </button>
              <div className="flex gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full ${
                      activeSlide === index ? 'w-8 bg-primary' : 'w-2.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink md:text-2xl">
              Available Now
            </h2>
            <p className="text-sm text-muted">Fast-moving kits ready for pickup.</p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            See All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
          {mockProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      <section className="app-shell space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-ink md:text-2xl">
            Browse by category
          </h2>
          <p className="text-sm text-muted">
            Tap a lane and jump straight into matching gear.
          </p>
        </div>
        <CategoryChips
          categories={categories}
          activeCategory="All"
          onSelect={(category) =>
            navigate(category === 'All' ? '/browse' : `/browse?category=${category}`)
          }
        />
      </section>

      <footer className="app-shell">
        <div className="card-surface px-6 py-8">
          <div className="grid gap-6 md:grid-cols-[1.6fr_1fr_1fr]">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-bold">CineKit</p>
                  <p className="text-xs text-muted">Professional camera rental house</p>
                </div>
              </div>
              <p className="max-w-md text-sm text-muted">
                Modern rentals for production teams, creator studios, and event
                shooters who need verified availability and a faster counter
                workflow.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Contact</h3>
              <div className="space-y-2 text-sm text-muted">
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
                  <Mail className="h-4 w-4 text-primary" /> hello@cinekit.in
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Follow</h3>
              <div className="flex gap-3">
                {[Instagram, Facebook, Youtube].map((Icon) => (
                  <button
                    key={Icon.name}
                    type="button"
                    onClick={() =>
                      addToast({
                        title: 'Demo social action',
                        message: `${Icon.name} would open from the live website.`,
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
            2026 CineKit. Demo mode.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
