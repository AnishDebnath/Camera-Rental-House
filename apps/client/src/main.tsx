import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastProvider } from './store/ToastContext';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { FavouritesProvider } from './store/FavouritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <FavouritesProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </FavouritesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
