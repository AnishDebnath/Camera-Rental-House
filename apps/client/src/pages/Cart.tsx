import { ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useCart } from '../store/CartContext';
import formatCurrency from '../utils/formatCurrency';

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, removeFromCart } = useCart();

  return (
    <div className="page-animate app-shell space-y-6 pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Rent Cart</h1>
          <p className="text-sm text-muted">Review your selected equipment before checkout.</p>
        </div>
        <span className="rounded-pill bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
          {items.length} items
        </span>
      </header>

      {items.length ? (
        <section className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="card-surface flex items-center gap-4 p-4">
              <img src={item.images?.[0]?.image_url} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-ink md:text-base">{item.name}</h3>
                <p className="mt-1 text-sm font-bold text-primary">{formatCurrency(item.price_per_day)}</p>
              </div>
              <button type="button" onClick={() => removeFromCart(item.id)} className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Your rent cart is empty"
          message="Start with cameras, lenses, and production accessories tailored for your next shoot."
          actionLabel="Explore Category"
          actionTo="/category"
          icon={<ShoppingBag className="h-8 w-8" />}
        />
      )}

      {items.length ? (
        <div className="fixed inset-x-0 bottom-20 border-t border-line bg-white/95 px-4 py-4 backdrop-blur md:bottom-0 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center gap-4">
            <div className="min-w-28">
              <p className="text-xs text-tertiary">Subtotal</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(subtotal)}</p>
            </div>
            <button type="button" onClick={() => navigate('/checkout')} className="primary-button flex-1">
              Proceed to Rent
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-sm text-muted">
          <Link to="/category" className="font-semibold text-primary">Continue Shopping</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
