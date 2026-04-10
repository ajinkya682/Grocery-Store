// src/pages/Products.jsx  — placeholder for future build
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Products = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="text-center">
      <p className="text-6xl mb-4">🛒</p>
      <h1 className="text-2xl font-bold text-forest mb-2">Products Page</h1>
      <p className="text-gray-500 text-sm mb-6">Coming soon — Phase 2</p>
      <Link to="/" className="btn-green inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  </div>
);

export default Products;
