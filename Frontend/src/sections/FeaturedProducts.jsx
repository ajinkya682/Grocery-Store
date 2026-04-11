// src/sections/FeaturedProducts.jsx
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const tabs = ['All', 'Rice & Grains', 'Lentils & Dal', 'Masalas & Spices', 'Oils', 'Flour & Atta', 'Dairy'];

const FeaturedProducts = () => {
  const { products } = useProduct();
  const [activeTab, setActiveTab] = useState('All');
  const [randomSix, setRandomSix] = useState([]);

  useEffect(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setRandomSix(shuffled.slice(0, 6));
  }, []);

  const filtered = activeTab === 'All'
    ? randomSix
    : products.filter(p => p.category === activeTab).slice(0, 6);

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
        <div className="adaptive-grid">
          {filtered.map((product, i) => (
            <div
              key={product._id || product.id}
              className="reveal h-full"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 glass-card rounded-[2.5rem]">
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-semibold text-forest">No products in this category yet.</p>
          </div>
        )}

        {/* Mobile view all */}
        <div className="sm:hidden mt-10">
          <Link to="/products" className="btn-primary w-full py-4 text-base font-black">
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
