// src/components/ui/CategoryCard.jsx
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index }) => {
  return (
    <div
      className="group relative overflow-visible cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-card bg-white p-2 rounded-2xl"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden rounded-xl">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
      </div>

      {/* Featured badge */}
      {category.name === 'Masalas & Spices' && (
        <span className="absolute top-4 right-4 bg-accent text-white text-xs px-2 py-1 rounded-md font-bold shadow-md z-10">
          Featured
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
