import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { reviews } from '../../data/reviews';
import LazyImage from '../../components/feature/LazyImage';

const Testimonials = () => {
  // Triple the reviews to ensure a seamless loop
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="space-y-6 pb-12 overflow-hidden">
      <div className="app-shell flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink md:text-2xl px-5">Reviews</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-slate-100">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 w-5 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-600">4.9/5 Rating</span>
        </div>
      </div>

      <div className="relative xl:app-shell">
        <div className="overflow-hidden">
          <motion.div
            animate={{
              x: [0, -1600],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-4 px-4"
          >
            {duplicatedReviews.map((review, index) => (
              <article
                key={`${review.id}-${index}`}
                className="min-w-[280px] max-w-[320px] shrink-0 flex flex-col justify-between rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/10">
                        <LazyImage
                          src={review.avatar}
                          alt={review.author}
                          aspectRatio="aspect-square"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{review.author}</h3>
                        <p className="text-[10px] font-medium text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-[#4285F4]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`}
                      />
                    ))}
                  </div>

                  <p className="line-clamp-4 text-xs font-medium leading-relaxed text-slate-600 italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-50 pt-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Google Verified</span>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Soft edge fade for better UI blend - hidden when app-shell container kicks in at xl (1280px) */}
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-page/60 to-transparent z-10 xl:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-page/60 to-transparent z-10 xl:hidden" /> */}
      </div>
    </section>
  );
};

export default Testimonials;
