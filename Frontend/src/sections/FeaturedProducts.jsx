// src/sections/FeaturedProducts.jsx
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

const tabs = ['All', 'Rice & Grains', 'Lentils', 'Masalas & Spices', 'Oils', 'Flour', 'Dairy'];

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <section id="featured-products" className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="section-tag">Featured</span>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link
            to="/products"
            id="featured-view-all"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors group"
          >
            View All <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200
                ${activeTab === tab
                  ? 'bg-forest text-white shadow-green'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-semibold">No products in this category yet.</p>
          </div>
        )}

        {/* Mobile view all */}
        <div className="sm:hidden mt-8 text-center">
          <Link to="/products" className="btn-green">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
