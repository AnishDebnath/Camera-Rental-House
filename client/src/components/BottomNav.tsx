import { Grid2x2, Heart, House, ShoppingBag, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const tabs = [
  { label: 'Home', href: '/', Icon: House },
  { label: 'Browse', href: '/browse', Icon: Grid2x2 },
  { label: 'Favourites', href: '/favourites', Icon: Heart },
  { label: 'Cart', href: '/cart', Icon: ShoppingBag },
  { label: 'Account', href: '/account', Icon: UserRound },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { items } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur xl:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {tabs.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className="flex min-h-16 flex-1 flex-col items-center justify-center gap-1 rounded-2xl"
            >
              <div className={`relative rounded-full p-2 ${active ? 'bg-primary-light text-primary' : 'text-tertiary'}`}>
                <Icon className="h-6 w-6" />
                {href === '/cart' && items.length ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {items.length}
                  </span>
                ) : null}
              </div>
              <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-tertiary'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
