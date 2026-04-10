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
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              id={`category-${category.slug}`}
              className="reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <CategoryCard category={category} index={i} />
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-6 text-center">
          <Link to="/products" className="btn-green text-sm">
            View All Categories <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
