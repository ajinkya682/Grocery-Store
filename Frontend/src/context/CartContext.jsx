// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
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
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('grocery_cart');
    if (stored) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(stored) });
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('grocery_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem    = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id)      => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty  = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart  = ()        => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  // WhatsApp order message builder
  const orderViaWhatsApp = (customerInfo = null) => {
    const phone = '919876543210'; // replace with real number
    const lines = state.items.map(
      i => `• ${i.name} (${i.weight}) × ${i.qty} = ₹${i.price * i.qty}`
    );
    let msgArr = [
      '🛒 *New Order from Grocery Store Website*',
      '',
    ];

    if (customerInfo && customerInfo.name) {
      msgArr.push(`*Customer Details:*`);
      msgArr.push(`Name: ${customerInfo.name}`);
      msgArr.push(`Mobile: ${customerInfo.mobile}`);
      msgArr.push(`Address: ${customerInfo.address}`);
      msgArr.push('');
    }

    msgArr.push('*Order Details:*');
    msgArr.push(...lines);
    msgArr.push('');
    
    const delivery = totalPrice >= 499 ? 0 : 40;
    msgArr.push(`*Subtotal: ₹${totalPrice}*`);
    if (delivery > 0) {
      msgArr.push(`*Delivery: ₹${delivery}*`);
    }
    msgArr.push(`*Total Amount: ₹${totalPrice + delivery}*`);
    msgArr.push('');
    msgArr.push('Please confirm my order. Thank you!');

    const msg = msgArr.join('\n');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, orderViaWhatsApp }}
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
