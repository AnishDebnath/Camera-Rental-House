import { Grid2x2, Heart, House, ShoppingBag, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../../store/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { label: 'Home', href: '/', Icon: House },
  { label: 'Explore', href: '/category', Icon: Grid2x2 },
  { label: 'Favourite', href: '/favourites', Icon: Heart },
  { label: 'Cart', href: '/cart', Icon: ShoppingBag },
  { label: 'Account', href: '/account', Icon: UserRound },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { items } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 xl:hidden pointer-events-none">
      <div className="relative flex h-16 w-full max-w-[420px] items-center justify-between rounded-[3rem] bg-indigo-50/20 px-2 shadow-[0_20px_50px_rgba(31,_38,_135,_0.1)] backdrop-blur-[40px] pointer-events-auto border border-white/60 before:absolute before:inset-0 before:rounded-[3rem] before:bg-gradient-to-br before:from-white/40 before:to-transparent before:p-[1px] before:-z-10 overflow-hidden ring-1 ring-black/[0.02]">
        {/* Subtle Liquid Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[3rem]" />

        {tabs.map(({ label, href, Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              to={href}
              className="relative flex h-full items-center z-10"
            >
              <AnimatePresence initial={false}>
                {active ? (
                  <motion.div
                    layoutId="active-pill"
                    transition={{ type: 'spring', duration: 0.6, bounce: 0.35 }}
                    className="flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-hover px-5 shadow-[0_10px_20px_rgba(255,107,0,0.25)] border border-white/20"
                  >
                    <Icon className="h-5 w-5 text-white drop-shadow-sm" />
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden whitespace-nowrap text-xs font-bold text-white tracking-widest uppercase"
                    >
                      {label}
                    </motion.span>
                  </motion.div>
                ) : (
                  <div className="relative flex h-12 w-12 items-center justify-center text-ink/40 transition-all duration-300 hover:text-primary active:scale-90">
                    <Icon className="h-5.5 w-5.5" />
                    {href === '/cart' && items.length > 0 && (
                      <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-primary border-[1.5px] border-white shadow-sm" />
                    )}
                  </div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
