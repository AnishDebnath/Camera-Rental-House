import { ShoppingBag, Trash2, ArrowRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';
import { useCart } from '../../store/CartContext';
import formatCurrency from '../../utils/formatCurrency';

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, removeFromCart } = useCart();

  return (
    <div className="page-animate">
      <div className="app-shell pt-2 pb-44">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-ink px-4">My Rent Cart</h1>
            </div>
            <p className="rounded-[100px] bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {items.length ? (
            <>
              <div className="flex flex-col gap-3 md:gap-4 px-2 md:px-0">
                {items.map((item) => (
                  <article key={item.id} className="group flex items-center gap-3 md:gap-4 rounded-[1.5rem] md:rounded-[2rem] border border-white/60 bg-white/40 p-3 md:p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
                    <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-[1rem] md:rounded-[1.2rem] border border-white shadow-sm bg-white/50">
                      <img src={item.images?.[0]?.image_url} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-0.5 md:space-y-1">
                      <h3 className="text-xs md:text-sm font-bold text-ink leading-tight line-clamp-1">{item.name}</h3>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 line-clamp-1">{item.category || 'Premium Equipment'}</p>
                      <p className="mt-1 flex items-baseline text-base md:text-lg font-extrabold tracking-tight text-primary">
                        {formatCurrency(item.price_per_day)}
                        <span className="ml-1 text-[9px] font-bold text-slate-400 tracking-wider uppercase">/ per day</span>
                      </p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-danger/10 text-danger transition-colors hover:bg-danger hover:text-white mr-1 md:mr-2">
                      <Trash2 className="h-4 w-4 md:h-4.5 md:w-4.5" />
                    </button>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 px-2 md:px-0">
                {/* Order Summary Card */}
                <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 md:p-8 backdrop-blur-xl transition-all duration-300">
                  {/* Decorative background element */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

                  <div className="relative space-y-8">
                    {/* Top Row: Unit & Price */}
                    <div className="flex items-center justify-between border-b border-white/40 pb-5">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Items Ordered</p>
                        <p className="text-base font-bold text-ink">{items.length} Items</p>
                      </div>

                      <div className="text-right space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Total Amount</p>
                        <p className="text-xl md:text-2xl font-black tracking-tight text-primary leading-none">
                          {formatCurrency(subtotal)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/category"
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/50 py-4 text-sm font-bold text-ink border border-white/80 transition-all hover:bg-white/80 hover:scale-[1.01] active:scale-[0.98]"
                      >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        Add More Gear
                      </Link>
                      <button
                        type="button"
                        onClick={() => navigate('/checkout')}
                        className="primary-button group flex-[1.5] py-4 shadow-xl shadow-primary/20 ring-1 ring-white/20"
                      >
                        Proceed to Rent
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="Your rent cart is empty"
              message="Start with cameras, lenses, and production accessories tailored for your next shoot."
              actionLabel="Explore Category"
              actionTo="/category"
              icon={<ShoppingBag className="h-8 w-8" />}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Cart;
