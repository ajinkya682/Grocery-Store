// src/components/ui/ProductCard.jsx
import { ShoppingCart, Plus, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import LazyImage from './LazyImage';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    
    // Simulate a brief loading state for "premium" feel
    setTimeout(() => {
      addItem(product);
      setAdding(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 400);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full relative">
      
      {/* Rapid Add Trigger (Floating on Image) */}
      {!outOfStock && (
        <button
          onClick={handleAdd}
          disabled={adding || isSuccess}
          className={`
            absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform
            ${isSuccess 
              ? 'bg-primary text-white scale-110' 
              : 'bg-white text-forest hover:bg-forest hover:text-white hover:scale-110'
            }
          `}
        >
          {adding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isSuccess ? (
            <Check size={18} />
          ) : (
            <Plus size={18} />
          )}
        </button>
      )}

      <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <LazyImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.badge && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg text-white ${
                product.badgeColor === 'red' ? 'bg-red-500' : 
                product.badgeColor === 'green' ? 'bg-forest' : 'bg-primary'
              }`}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-secondary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                SAVE {discount}%
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{product.category}</span>
            {lowStock && !outOfStock && (
              <span className="text-[9px] font-bold text-red-500 animate-pulse uppercase">Only {product.stock} left!</span>
            )}
          </div>
          
          <h3 className="text-base font-bold text-forest leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-500 font-medium mb-4">{product.weight}</p>

          {/* Pricing Section */}
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
              )}
              <span className="text-xl font-black text-forest">₹{product.price}</span>
            </div>
            
            <div className="text-[10px] font-bold text-secondary flex items-center gap-1">
              <Check size={12} /> 100% Pure
            </div>
          </div>
        </div>
      </Link>

      {/* Main CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={handleAdd}
          disabled={outOfStock || adding || isSuccess}
          className={`
            w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black tracking-wide uppercase transition-all duration-300 ripple
            ${outOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : isSuccess
                ? 'bg-primary text-white shadow-lg'
                : 'bg-forest hover:bg-[#07261d] text-white shadow-xl hover:shadow-forest/20 active:scale-95'
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
            <><ShoppingCart size={18} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
