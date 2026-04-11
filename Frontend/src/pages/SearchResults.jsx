// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { searchProducts } = useProduct();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data || []);
      } catch (error) {
        console.error("Failed to search products", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);

  return (
    <div className="bg-light min-h-[70vh] py-12">
      <div className="container-custom">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-dark">
            Search Results
          </h1>
          <p className="text-gray-500 mt-2">
            Showing results for <span className="font-bold text-primary">"{query}"</span>
          </p>
        </div>

        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-64 border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between">
                <div className="w-full bg-gray-100 aspect-square rounded-xl mb-4" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="mt-auto h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          // Results Grid
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-16 shadow-soft text-center mt-8 border border-gray-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Search className="text-accent w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              We couldn't find any items matching your search query. Try checking your spelling or using more general terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
