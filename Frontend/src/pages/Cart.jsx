import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, removeItem, updateQty, totalPrice, totalItems, orderViaWhatsApp } = useCart();
  const { currentUser, isUserAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [isUserAuthenticated, navigate, location.pathname]);

  if (!isUserAuthenticated) return null;

  const handleCheckout = () => {
    orderViaWhatsApp();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-light flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black text-forest mb-3">Your Basket is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm font-medium">Explore our premium selections and start filling your basket with heritage flavors.</p>
        <Link to="/products" className="btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  const deliveryFee = totalPrice >= 499 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Checkout</span>
            <h1 className="text-[2.5rem] font-display font-black text-forest leading-tight">Review Your Order</h1>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-card border border-gray-100">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Items</p>
              <p className="font-bold text-forest leading-none">{totalItems} Products</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-card p-8 border border-gray-100">
              <div className="space-y-8">
                {items.map((item, index) => (
                  <div key={item.id} className={`flex gap-6 ${index !== items.length - 1 ? 'border-b border-gray-50 pb-8' : ''}`}>
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.images?.[0]?.url || item.image || '/placeholder-grocery.png'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-black text-forest text-lg truncate">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id, item.weight)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-400">{item.weight}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-primary font-black text-xl">₹{item.price}</p>
                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                          <button onClick={() => updateQty(item.id, item.qty - 1, item.weight)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-primary">−</button>
                          <span className="font-black text-forest w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1, item.weight)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-primary">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-xs font-bold text-gray-500 leading-tight">Freshly packed from Heritage stocks</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                  <MapPin size={24} />
                </div>
                <p className="text-xs font-bold text-gray-500 leading-tight">Reliable delivery across your area</p>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-5 space-y-8 sticky top-28">
            
            {/* Delivery Info Box */}
            <div className="bg-forest text-white rounded-[2.5rem] shadow-card p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
               <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
                 <MapPin size={14} /> Delivering To
               </h3>
               
               <div className="space-y-4 relative z-10">
                 <div>
                   <p className="text-2xl font-black">{currentUser.name}</p>
                   <p className="text-sm font-bold opacity-80 mt-1">{currentUser.mobile}</p>
                 </div>
                 <div className="pt-4 border-t border-white/10">
                   <p className="text-sm font-medium leading-relaxed italic">
                     "{currentUser.address}, {currentUser.pincode}"
                   </p>
                 </div>
                 <Link to="/login" className="inline-block text-[10px] font-black uppercase tracking-widest text-accent hover:underline pt-2">
                   Edit Profile Details
                 </Link>
               </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-[2.5rem] shadow-card p-8 border border-gray-100">
              <h3 className="text-lg font-black text-forest mb-6">Price Details</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">Items Total</span>
                  <span className="font-black text-forest">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-sm font-black text-primary uppercase tracking-widest">Free</span>
                  ) : (
                    <span className="font-black text-forest">₹{deliveryFee}</span>
                  )}
                </div>
                {deliveryFee > 0 && (
                  <div className="bg-amber-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      Spend ₹{499 - totalPrice} more for FREE delivery
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Payable</p>
                  <p className="text-4xl font-black text-primary">₹{finalTotal}</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-whatsapp py-5 rounded-2xl flex flex-col items-center gap-0.5"
              >
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span className="text-lg font-black">Place Order via WhatsApp</span>
                </div>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Secure Heritage Checkout</span>
              </button>

              <p className="text-center mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                Verified Secure Order System
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;
