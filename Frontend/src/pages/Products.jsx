// src/pages/Products.jsx
import { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const categories = [
  'All',
  'Rice & Grains',
  'Atta & Flour',
  'Oils & Ghee',
  'Spices',
  'Masala',
  'Dairy',
  'Packaged',
  'Other'
];

const Products = () => {
  const { products, categories: dynamicCategories } = useProduct();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';

  const displayCategories = ['All', ...dynamicCategories];

  // Map URL category to our array if needed, keeping it simple
  const resolveCategory = (c) => {
    switch(c) {
      case 'rice-grains': return 'Rice & Grains';
      case 'masalas-spices': return 'Masala'; // fallback
      case 'flour': return 'Staples';
      case 'oils': return 'Cooking Essentials';
      case 'dairy': return 'Dairy & Bakery';
      default: return displayCategories.includes(c) ? c : 'All';
    }
  };

  const [activeCategory, setActiveCategory] = useState(resolveCategory(initialCategory));
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setActiveCategory(resolveCategory(searchParams.get('category') || 'All'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(1); // Reset page on category change via URL
  }, [location.search]);

  // Reset page when category or search changes manually
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (activeCategory !== 'All') {
      result = result.filter(p => {
        // Some flexible matching since product categories might not perfectly align with sidebar
        if (activeCategory === 'Masala' && p.category === 'Masalas & Spices') return true;
        if (activeCategory === 'Atta & Flour' && p.category === 'Flour') return true;
        if (activeCategory === 'Oils & Ghee' && p.category === 'Oils') return true;
        return p.category === activeCategory;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    return result;
  }, [activeCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-16">
      
      {/* Category Header Area */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="flex items-center text-xs text-gray-400 mb-6 font-medium">
            <Link to="/" className="hover:text-forest transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-600">{activeCategory}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-forest mb-2">{activeCategory === 'All' ? 'Our Products' : activeCategory}</h1>
              <p className="text-gray-500">{filteredProducts.length} premium harvests curated for your kitchen</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Sort by:</span>
              <div className="relative group">
                <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-2 rounded-xl transition-colors outline-none ring-primary-100 focus:ring-4">
                  Default <ChevronDown size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white rounded-2xl shadow-card font-semibold text-forest border border-gray-100"
          >
            <Filter size={18} /> {mobileFilterOpen ? 'Hide Filters' : 'Filter Products'}
          </button>

          {/* Left Sidebar: Categories */}
          <aside className={`lg:w-64 flex-shrink-0 bg-white rounded-3xl p-6 shadow-card border border-gray-100 transition-all ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <h3 className="text-xs font-bold tracking-widest uppercase text-saffron-600 mb-4 pl-4">Filter By Category</h3>
            <ul className="space-y-1">
              {displayCategories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => { setActiveCategory(cat); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-medium ${
                      activeCategory === cat 
                        ? 'bg-forest text-white shadow-md font-semibold' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-forest'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Right Content: Search & Grid */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Search Bar */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-saffron-500" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search products in ${activeCategory}...`}
                className="w-full bg-white px-12 py-4 rounded-2xl border border-gray-100 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {paginatedProducts.map((product, idx) => (
                  <div key={`${product.id}-${idx}`} className="h-full flex">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-20 flex flex-col items-center justify-center text-center px-4">
                <p className="text-6xl mb-4 opacity-50">🌾</p>
                <h3 className="text-xl font-bold text-forest mb-2">No products found</h3>
                <p className="text-gray-500 max-w-sm">We couldn't find any products matching your current filters. Try adjusting your search or category.</p>
                <button 
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-6 text-primary-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-sm font-semibold text-gray-400 hover:text-forest disabled:opacity-50 transition-colors px-2"
                >
                  ‹ Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-colors ${
                        currentPage === page 
                          ? 'bg-forest text-white shadow-md' 
                          : 'bg-transparent hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-sm font-semibold text-gray-600 hover:text-forest disabled:opacity-50 transition-colors px-2"
                >
                  Next ›
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
