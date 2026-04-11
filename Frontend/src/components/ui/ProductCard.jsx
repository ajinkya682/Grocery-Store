// src/components/ui/ProductCard.jsx
import { ShoppingBag, Plus, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LazyImage from './LazyImage';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { isUserAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUserAuthenticated) {
      navigate('/userlogin', { state: { from: location.pathname } });
      return;
    }

    setAdding(true);
    
    // Simulate a brief loading state for "premium" feel
    setTimeout(() => {
      const success = addItem(product);
      if (success) {
        setAdding(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
      } else {
        setAdding(false);
      }
    }, 400);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative"
    >
      
      {/* Rapid Add Trigger (Floating on Image) */}
      {!outOfStock && (
        <button
          onClick={handleAdd}
          disabled={adding || isSuccess}
          className={`
            absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform
            ${isSuccess 
              ? 'bg-primary text-white' 
              : 'bg-white/90 backdrop-blur-md text-forest hover:bg-forest hover:text-white'
            }
          `}
        >
          {adding ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isSuccess ? (
            <Check size={20} />
          ) : (
            <Plus size={20} />
          )}
        </button>
      )}

      <Link to={`/product/${product._id || product.id}`} className="flex flex-col flex-grow">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[4/5] sm:aspect-square">
          <LazyImage
            src={product.images && product.images.length > 0 ? product.images[0].url : product.image || '/placeholder-grocery.png'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex flex-col gap-2 z-10">
            {product.badge && (
              <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg text-white ${
                product.badgeColor === 'red' ? 'bg-red-500' : 
                product.badgeColor === 'green' ? 'bg-forest' : 'bg-primary'
              }`}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-accent text-white text-[8px] sm:text-[10px] font-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center p-4">
              <span className="bg-gray-800 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl text-center">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1 sm:mb-2">
            <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{product.category}</span>
          </div>
          
          <h3 className="text-sm sm:text-lg font-bold text-forest leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-gray-500 font-bold mb-3 sm:mb-4">{product.unit || product.weight}</p>

          {/* Pricing Section */}
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-bold">₹{product.originalPrice}</span>
              )}
              <span className="text-lg sm:text-2xl font-black text-forest">₹{product.price}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Mobile-Friendly Add Button */}
      <div className="px-3 sm:px-6 pb-3 sm:pb-6">
        <button
          onClick={handleAdd}
          disabled={outOfStock || adding || isSuccess}
          className={`
            w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black tracking-widest uppercase transition-all duration-300
            ${outOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : isSuccess
                ? 'bg-primary text-white shadow-lg'
                : 'bg-forest hover:bg-[#07261d] text-white shadow-xl active:scale-95'
            }
          `}
        >
          {outOfStock ? (
            'Unavailable'
          ) : adding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isSuccess ? (
            <><Check size={18} /> In Cart</>
          ) : (
            <><ShoppingBag size={18} /> Add</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
