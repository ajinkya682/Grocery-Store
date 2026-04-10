// src/pages/Cart.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, removeItem, updateQty, totalPrice, totalItems, orderViaWhatsApp } = useCart();
  const [userInfo, setUserInfo] = useState({
    name: '',
    mobile: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (!userInfo.name || !userInfo.mobile || !userInfo.address) {
      alert("Please fill in all your details for delivery.");
      return;
    }
    orderViaWhatsApp(userInfo);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-cream flex flex-col items-center justify-center py-12 px-4">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingCart size={40} className="text-primary-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-forest mb-3">Your Basket is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added any items yet. Explore our fresh and premium selections.</p>
        <Link to="/products" className="btn-green inline-flex items-center gap-2 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Start Shopping
        </Link>
      </div>
    );
  }

  const deliveryFee = totalPrice >= 499 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-forest">Review Your Order</h1>
            <p className="text-gray-500 text-sm">{totalItems} items in your basket</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-forest mb-6 border-b border-gray-100 pb-4">Cart Items</h2>
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className={`flex items-center gap-4 ${index !== items.length - 1 ? 'border-b border-gray-50 pb-6' : ''}`}>
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-base line-clamp-1">{item.name}</p>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">{item.weight}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-primary-700 font-bold text-lg">₹{item.price}</p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-100">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center text-gray-600 font-bold transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-forest">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 shadow-sm flex items-center justify-center text-white font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 h-10 w-10 self-start mt-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors flex items-center justify-center"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Form & Summary */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* Delivery Details Form */}
            <div className="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-forest mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-primary-500" />
                Delivery Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-gray-400"/> Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400"/> Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    name="mobile"
                    value={userInfo.mobile}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400"/> Complete Address
                  </label>
                  <textarea 
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    placeholder="House no, Building, Street, Area, Landmark..." 
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-card p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none"></div>
              
              <h2 className="text-xl font-bold text-forest mb-5 relative z-10">Order Summary</h2>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-800">₹{totalPrice}</span>
                </div>
                
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium">Delivery</span>
                  {deliveryFee === 0 ? (
                     <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-md text-sm">FREE</span>
                  ) : (
                     <span className="font-semibold text-gray-800">₹{deliveryFee}</span>
                  )}
                </div>
                
                {deliveryFee > 0 && (
                  <p className="text-xs text-saffron-600 bg-saffron-50 p-2 rounded-lg mt-1 border border-saffron-100">
                    Add ₹{499 - totalPrice} more for FREE delivery
                  </p>
                )}
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                    <span className="font-display font-bold text-xl text-forest">Total</span>
                    <span className="font-bold text-2xl text-primary-700">₹{finalTotal}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="btn-whatsapp w-full justify-center mt-6 text-base py-4 rounded-2xl relative z-10 group overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
                <span className="relative z-10 font-bold">Secure WhatsApp Order</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;
