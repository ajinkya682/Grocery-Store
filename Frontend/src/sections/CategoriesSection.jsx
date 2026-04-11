// src/sections/CategoriesSection.jsx
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import CategoryCard from '../components/ui/CategoryCard';

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-14 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="section-tag">Categories</span>
            <h2 className="section-title">Browse Essentials</h2>
          </div>
          <Link
            to="/products"
            id="categories-view-all"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors group"
          >
            View All
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category grid */}
        <div className="adaptive-grid">
          {categories.slice(0, 5).map((category, i) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              id={`category-${category.slug}`}
              className="reveal h-full"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <CategoryCard category={category} index={i} />
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-8">
          <Link to="/products" className="btn-secondary w-full py-4 text-base font-black border-primary/10">
            View All Categories
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
