import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';
import { AUTH_KEYS } from '../config/constants';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { ordersAPI } from '../api/apiService';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  // ... (keep reducer logic same)
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
  const { storeSettings } = useStore();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (!isUserAuthenticated) return false;
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

  const orderViaWhatsApp = async () => {
    if (!isUserAuthenticated || !currentUser) return;
    
    // 1. Validate Store Configuration
    if (!storeSettings?.contact?.whatsapp) {
      alert("Store WhatsApp contact is not configured. Please contact the store administrator.");
      return;
    }
    
    // 2. Validate Cart
    if (state.items.length === 0) {
      alert("Your cart is empty! Add some products before checking out.");
      return;
    }

    // 3. Validate User Profile (Address & Pincode)
    if (!currentUser.address || !currentUser.pincode) {
      alert("Please complete your address and pincode in your profile before placing an order.");
      return;
    }

    try {
      setIsProcessing(true);

      // 2. Prepare order payload for Backend
      const orderData = {
        items: state.items.map(item => ({
          productId: item._id || item.id,
          quantity: item.qty,
          name: item.name,
          price: item.price
        })),
        shippingAddress: {
          name: currentUser.name || 'Valued Customer',
          phone: (currentUser.mobile || '').replace(/\D/g, '').slice(-10), // Clean: only last 10 digits
          address: currentUser.address || 'Address Not Provided',
          city: 'Kolhapur',
          pincode: (currentUser.pincode || '416000').replace(/\D/g, '').slice(0, 6) // Clean: only 6 digits
        },
        paymentMethod: 'COD'
      };

      // 3. Persist Order in MongoDB
      const { data } = await ordersAPI.create(orderData);
      
      if (data.success) {
        const order = data.data.order;
        
        // 4. Generate Link & Redirect
        const waUrl = generateWhatsAppLink({
          order,
          currentUser
        }, storeSettings);

        window.open(waUrl, '_blank');
        
        // 5. Cleanup
        dispatch({ type: 'CLEAR_CART' });
        closeCart();
      }
    } catch (err) {
      console.error('SaaS v4 Order Persistence Failed:', err);
      alert(err.response?.data?.message || 'Order creation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        items: state.items, addItem, removeItem, updateQty, clearCart, 
        totalItems, totalPrice, orderViaWhatsApp,
        isCartOpen, setIsCartOpen, toggleCart, openCart, closeCart,
        isProcessing
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
