// src/pages/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Truck, CheckCircle2, RefreshCcw, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem, orderViaWhatsApp } = useCart();
  const { products } = useProduct();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');

  useEffect(() => {
    const found = products.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);
      setActiveImage(found.image);
      setSelectedWeight(found.weight);
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xl text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addItem(product);
    }
    alert(`${quantity}x ${product.name} added to cart!`);
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const origin = product.origin || 'Kolhapur, India';
  const ingredients = product.ingredients || '100% Pure & Natural';
  const authenticity = product.authenticity || 'Store-certified';
  const availableWeights = product.availableWeights || [{ label: product.weight }];
  const thumbnails = product.thumbnails || [product.image];
  const longDesc = product.longDescription || product.description || 'Premium quality groceries freshly delivered.';
  
  return (
    <div className="bg-light pb-20">
      <div className="container-custom pt-8 pb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs font-semibold text-gray-400 mb-8 tracking-wide">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-1" />
          <Link to={`/products?category=${product.category.toLowerCase().replace(/\s+/g,'-')}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-dark truncate max-w-xs">{product.name}</span>
        </div>

        {/* Hero Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-8">
              {product.inStock && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 border border-gray-100 font-bold text-[10px] tracking-widest text-primary uppercase">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  In Stock
                </div>
              )}
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-300 transform" 
              />
            </div>
            
            {/* Thumbnails */}
            {thumbnails.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {thumbnails.map((thumb, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`aspect-square rounded-xl bg-white border shadow-sm overflow-hidden p-2 transition-all ${
                      activeImage === thumb ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <img src={thumb} className="w-full h-full object-cover rounded-md" alt={`Thumbnail ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-dark leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Weight Selection */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Select Weight</p>
              <div className="flex flex-wrap gap-3">
                {availableWeights.map(w => (
                  <button 
                    key={w.label}
                    onClick={() => setSelectedWeight(w.label)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                      selectedWeight === w.label 
                        ? 'bg-primary text-white scale-105 shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantifer */}
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-2 shadow-sm w-full sm:w-32 h-14">
                <button onClick={decreaseQty} className="p-3 text-gray-400 hover:text-primary transition-colors"><Minus size={16} /></button>
                <span className="font-bold text-dark text-lg w-6 text-center">{quantity}</span>
                <button onClick={increaseQty} className="p-3 text-gray-400 hover:text-primary transition-colors"><Plus size={16} /></button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-[#07261d] text-white font-bold text-base h-14 rounded-xl shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                Add to Cart
              </button>
            </div>

            <button 
              onClick={orderViaWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm h-14 rounded-xl shadow-sm transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              Order via WhatsApp
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <Truck size={22} className="text-secondary" />
                <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-2 border-l border-r border-gray-100">
                <CheckCircle2 size={22} className="text-secondary" />
                <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Fresh Quality</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <RefreshCcw size={22} className="text-secondary" />
                <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Details Sections */}
      <div className="container-custom py-12">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: 'Origin', val: origin },
            { label: 'Ingredients', val: ingredients },
            { label: 'Weight', val: `${availableWeights.length} Sizes Available` },
            { label: 'Authenticity', val: authenticity }
          ].map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">{stat.label}</p>
              <p className="text-sm font-bold text-dark">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Info Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-display font-bold text-dark mb-6">About This Product</h2>
            <div className="prose prose-sm md:prose-base text-gray-600 leading-loose max-w-none whitespace-pre-wrap">
              {longDesc}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#fefce8] p-8 rounded-3xl border border-yellow-100 shadow-sm sticky top-28">
              <h3 className="font-bold flex items-center gap-2 text-dark mb-6">
                <span className="text-secondary">💪</span> Nutritional Info
              </h3>
              
              <ul className="space-y-4">
                {product.nutritionalInfo ? Object.entries(product.nutritionalInfo).map(([key, val]) => (
                  <li key={key} className="flex items-center justify-between border-b border-yellow-200/50 pb-3 last:border-0 last:pb-0">
                    <span className="capitalize text-gray-500 text-sm">{key}</span>
                    <span className="font-bold text-dark text-sm">{val}</span>
                  </li>
                )) : (
                  <li className="text-sm text-gray-500 text-center py-4">Data not available</li>
                )}
              </ul>
              
              <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-wider">* values per 100g of uncooked raw product</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold font-display text-dark">You might also like</h2>
            <div className="hidden sm:flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all shadow-sm">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
