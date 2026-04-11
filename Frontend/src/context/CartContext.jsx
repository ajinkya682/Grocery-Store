import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { AUTH_KEYS, WHATSAPP_NUMBER } from '../config/constants';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const payloadId = action.payload._id || action.payload.id;
      const existing = state.items.find(i => (i._id || i.id) === payloadId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            (i._id || i.id) === payloadId ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => (i._id || i.id) !== action.payload) };
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => (i._id || i.id) !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          (i._id || i.id) === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { currentUser, isUserAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load user-specific cart on login/start
  useEffect(() => {
    if (isUserAuthenticated && currentUser?.mobile) {
      const allCarts = JSON.parse(localStorage.getItem(AUTH_KEYS.CARTS) || '{}');
      const userCart = allCarts[currentUser.mobile] || [];
      dispatch({ type: 'LOAD_CART', payload: userCart });
    } else {
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
  }, [isUserAuthenticated, currentUser?.mobile]);

  // Persist user-specific cart on changes
  useEffect(() => {
    if (isUserAuthenticated && currentUser?.mobile) {
      const allCarts = JSON.parse(localStorage.getItem(AUTH_KEYS.CARTS) || '{}');
      allCarts[currentUser.mobile] = state.items;
      localStorage.setItem(AUTH_KEYS.CARTS, JSON.stringify(allCarts));
    }
  }, [state.items, isUserAuthenticated, currentUser?.mobile]);

  const addItem = (product) => {
    if (!isUserAuthenticated) {
      // In a real app, we might trigger a toast here
      return false; // Signal failure to the component
    }
    dispatch({ type: 'ADD_ITEM', payload: product });
    setIsCartOpen(true);
    return true;
  };

  const removeItem = (id)      => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty  = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart  = ()        => dispatch({ type: 'CLEAR_CART' });

  const toggleCart = () => {
    if (!isUserAuthenticated) return false;
    setIsCartOpen(!isCartOpen);
    return true;
  };

  const openCart = () => {
    if (!isUserAuthenticated) return false;
    setIsCartOpen(true);
    return true;
  };

  const closeCart  = () => setIsCartOpen(false);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  const orderViaWhatsApp = () => {
    if (!isUserAuthenticated || !currentUser) return;

    const itemsList = state.items.map(
      i => `- ${i.name} (${i.unit || i.weight}) x${i.qty}`
    ).join('\n');

    const message = `
Hello, I want to place an order:

*Customer Information:*
Name: ${currentUser.name}
Mobile: ${currentUser.mobile}
Address: ${currentUser.address} - ${currentUser.pincode}

*Order Details:*
${itemsList}

*Subtotal: ₹${totalPrice}*
*Delivery: ₹${totalPrice >= 499 ? 0 : 40}*
*Total: ₹${totalPrice + (totalPrice >= 499 ? 0 : 40)}*

Please confirm my order. Thank you!
`.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <CartContext.Provider
      value={{ 
        items: state.items, addItem, removeItem, updateQty, clearCart, 
        totalItems, totalPrice, orderViaWhatsApp,
        isCartOpen, setIsCartOpen, toggleCart, openCart, closeCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
