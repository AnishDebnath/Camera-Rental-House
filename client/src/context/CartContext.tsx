import { createContext, useContext, useMemo, useState } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cinekit_demo_cart');
    return stored ? JSON.parse(stored) : [];
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('cinekit_demo_cart', JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      items,
      subtotal: items.reduce((sum, item) => sum + item.price_per_day, 0),
      addToCart: (product) => {
        if (items.some((item) => item.id === product.id)) return;
        persist([...items, product]);
        addToast({ title: 'Added to cart', message: product.name, tone: 'success' });
      },
      removeFromCart: (productId) => {
        persist(items.filter((item) => item.id !== productId));
        addToast({ title: 'Removed from cart', message: 'Item removed.', tone: 'info' });
      },
      clearCart: () => persist([]),
    }),
    [addToast, items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
