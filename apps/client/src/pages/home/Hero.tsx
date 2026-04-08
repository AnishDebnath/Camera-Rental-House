import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroSlides } from '../../data/mockProducts';

const Hero = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  return (
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
              onClick={() => navigate('/category')}
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
  );
};

export default Hero;
