// src/components/ui/ProductCard.jsx
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Badge from './Badge';

const ProductCard = ({ product }) => {
  const { addItem, items } = useCart();
  const [added, setAdded]  = useState(false);

  const inCart = items.some(i => i.id === product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card card-hover border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          style={{ transform: 'scale(1)', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <Badge label={product.badge} color={product.badgeColor} />
          )}
          {discount > 0 && (
            <span className="inline-block text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.weight}</p>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-forest">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAdd}
          className={`
            mt-auto w-full flex items-center justify-center gap-2
            py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-300
            ${added
              ? 'bg-primary-600 text-white'
              : 'bg-saffron-500 hover:bg-saffron-600 text-white hover:-translate-y-0.5 shadow-md'
            }
          `}
        >
          {added ? (
            <><Check size={15} /> Added!</>
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
