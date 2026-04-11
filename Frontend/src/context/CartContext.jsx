import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';
import { AUTH_KEYS } from '../config/constants';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { ordersAPI } from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
    if (!isUserAuthenticated || !currentUser) {
      showToast("Please login to place an order or inquiry.", "error");
      return;
    }
    
    // 1. Validate Store Configuration
    if (!storeSettings?.contact?.whatsapp) {
      showToast("Store contact not configured", "error");
      return;
    }
    
    // 2. Branch Check: Empty Cart Fallback (Lead Generation)
    if (state.items.length === 0) {
      showToast("Cart is empty, sending inquiry", "success");
      
      const inquiryLink = generateWhatsAppLink({
        type: 'inquiry',
        currentUser
      }, storeSettings);

      if (inquiryLink) {
        window.open(inquiryLink, '_blank');
        closeCart();
      }
      return;
    }

    // 3. Normal Order Flow: Validate User Profile (Address & Pincode)
    if (!currentUser.address || !currentUser.pincode) {
      showToast("Please complete your address in your profile first.", "error");
      return;
    }

    try {
      setIsProcessing(true);

      // Prepare order payload for Backend
      const orderData = {
        items: state.items.map(item => ({
          productId: item._id || item.id,
          quantity: item.qty,
          name: item.name,
          price: item.price
        })),
        shippingAddress: {
          name: currentUser.name || 'Valued Customer',
          phone: (currentUser.mobile || '').replace(/\D/g, '').slice(-10),
          address: currentUser.address || 'Address Not Provided',
          city: 'Kolhapur',
          pincode: (currentUser.pincode || '416000').replace(/\D/g, '').slice(0, 6)
        },
        paymentMethod: 'COD'
      };

      // Persist Order in MongoDB
      const { data } = await ordersAPI.create(orderData);
      
      if (data.success) {
        const order = data.data.order;
        
        // Generate Link & Redirect
        const waUrl = generateWhatsAppLink({
          order,
          currentUser
        }, storeSettings);

        if (waUrl) {
          window.open(waUrl, '_blank');
          dispatch({ type: 'CLEAR_CART' });
          closeCart();
        }
      }
    } catch (err) {
      console.error('Order Flow Failed:', err);
      showToast(err.response?.data?.message || 'Order creation failed.', 'error');
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
        isProcessing, showToast
      }}
    >
      {children}

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest ${
              toast.type === 'success' ? 'bg-forest text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition-all">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );

};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
