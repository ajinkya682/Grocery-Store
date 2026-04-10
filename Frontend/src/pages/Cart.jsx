// src/pages/Cart.jsx — placeholder
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, removeItem, updateQty, totalPrice, totalItems, orderViaWhatsApp } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold text-forest mb-2">Your cart is empty</h1>
          <p className="text-gray-500 text-sm mb-6">Add some fresh groceries to get started.</p>
          <Link to="/" className="btn-green inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="container-custom max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-forest">Review Your Basket</h1>
          <span className="ml-auto bg-saffron-100 text-saffron-600 text-sm font-bold px-3 py-1 rounded-full">
            {totalItems} items
          </span>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.weight}</p>
                <p className="text-primary-700 font-bold text-sm mt-1">₹{item.price}</p>
              </div>
              {/* Qty controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-7 h-7 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center text-primary-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
            <span>Subtotal ({totalItems} items)</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
            <span>Delivery</span>
            <span className="text-primary-600 font-semibold">{totalPrice >= 499 ? 'FREE' : '₹40'}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center font-bold text-lg text-forest">
            <span>Total</span>
            <span>₹{totalPrice >= 499 ? totalPrice : totalPrice + 40}</span>
          </div>
          <button
            id="cart-whatsapp-order"
            onClick={orderViaWhatsApp}
            className="btn-whatsapp w-full justify-center mt-5 text-base py-3.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
