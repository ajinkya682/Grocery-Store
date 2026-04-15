// src/components/ui/AdaptiveCart.jsx
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdaptiveCart = () => {
  const { items, totalPrice, updateQty, removeItem, isCartOpen, closeCart, orderViaWhatsApp } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    // navigate('/checkout'); // If there's a checkout page, or just WhatsApp
    orderViaWhatsApp();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Cart Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[160] max-h-[90vh] flex flex-col shadow-2xl safe-area-inset-bottom lg:right-0 lg:left-auto lg:top-0 lg:bottom-0 lg:h-full lg:w-[450px] lg:rounded-none lg:rounded-l-[2.5rem]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-forest">Your Cart</h3>
                  <p className="text-xs font-bold text-gray-400">{items.length} items selected</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Your cart is empty</h4>
                    <p className="text-sm text-gray-500">Add some farm-fresh items to get started!</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary mt-4"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={`${item._id || item.id}-${item.weight || 'default'}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-3xl"
                  >
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0].url : item.image || '/placeholder-grocery.png'}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-forest truncate pr-2">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item._id || item.id, item.weight)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        {item.unit || item.weight}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQty(item._id || item.id, item.qty - 1, item.weight)}
                            className="w-7 h-7 flex items-center justify-center text-forest hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-black min-w-[20px] text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item._id || item.id, item.qty + 1, item.weight)}
                            className="w-7 h-7 flex items-center justify-center text-forest hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-black text-forest">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 space-y-4 shadow-[0_-20px_40px_rgba(0,0,0,0.03)]">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-500">Subtotal</span>
                    <span className="font-black text-forest">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-500">Delivery</span>
                    <span className="font-black text-primary">
                      {totalPrice >= 499 ? 'FREE' : '₹40'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                    <span className="text-base font-black text-forest">Total Amount</span>
                    <span className="text-xl font-black text-primary">
                      ₹{totalPrice + (totalPrice >= 499 ? 0 : 40)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-4 rounded-[1.5rem] flex items-center justify-center gap-3 group"
                >
                  <span className="text-base font-black">Checkout via WhatsApp</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">
                  Secure WhatsApp Ordering
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdaptiveCart;
