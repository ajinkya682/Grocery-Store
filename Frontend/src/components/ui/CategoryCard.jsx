// src/components/ui/CategoryCard.jsx
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer reveal"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden rounded-2xl border border-gray-100 shadow-card">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-90"
        />
      </div>

      {/* Hot badge */}
      {category.hot && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow">
          🔥 Hot
        </span>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between text-white">
          <span className="text-xs font-semibold">{category.count} items</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* Name */}
      <p className="mt-2 text-center text-xs font-semibold text-gray-700 leading-tight px-1 truncate">
        {category.icon} {category.name}
      </p>
    </div>
  );
};

export default CategoryCard;
