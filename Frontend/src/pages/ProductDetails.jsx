// src/pages/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Truck, CheckCircle2, RefreshCcw, ChevronLeft, ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ui/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem, orderViaWhatsApp, openCart } = useCart();
  const { products } = useProduct();
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');

  useEffect(() => {
    const found = products.find(p => p._id === id || p.id === id || p.id === parseInt(id));
    if (found) {
      setProduct(found);
      const imgUrl = found.images && found.images.length > 0 ? found.images[0].url : found.image || '/placeholder-grocery.png';
      setActiveImage(imgUrl);
      setSelectedWeight(found.unit || found.weight);
      window.scrollTo(0, 0);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xl text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    let success = true;
    for (let i = 0; i < quantity; i++) {
        const res = addItem(product);
        if (!res) success = false;
    }
    
    if (success) {
      openCart();
    }
  };

  const handleWhatsAppOrder = () => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    orderViaWhatsApp();
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const origin = product.origin || 'Kolhapur, India';
  const ingredients = product.ingredients || '100% Pure & Natural';
  const authenticity = product.authenticity || 'Store-certified';
  const availableWeights = product.availableWeights || [{ label: product.unit || product.weight }];
  const thumbnails = (product.images && product.images.length > 0) ? product.images.map(img => img.url) : [product.image || '/placeholder-grocery.png'];
  const longDesc = product.longDescription || product.description || 'Premium quality groceries freshly delivered.';
  
  const isMobile = window.innerWidth < 768;

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-0">
      {/* Mobile Sticky Action Bar */}
      {isMobile && product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 z-[100] flex items-center gap-4 safe-area-inset-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1 border border-gray-100">
            <button onClick={decreaseQty} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary"><Minus size={18} /></button>
            <span className="font-black text-forest w-6 text-center">{quantity}</span>
            <button onClick={increaseQty} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary"><Plus size={18} /></button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white font-black text-sm h-14 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Add to Cart • ₹{product.price * quantity}
          </button>
        </div>
      )}

      <div className="container-custom pt-4 lg:pt-12 pb-12">
        {/* Breadcrumbs - Desktop Only */}
        {!isMobile && (
          <div className="flex items-center text-xs font-semibold text-gray-400 mb-8 tracking-wide">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-dark truncate max-w-xs">{product.name}</span>
          </div>
        )}

        {/* Hero Product Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left: Images */}
          <div className="space-y-4 -mx-4 lg:mx-0">
            <div className="relative aspect-square lg:rounded-[2.5rem] bg-gray-50 overflow-hidden flex items-center justify-center">
              {product.inStock && (
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur shadow-xl px-4 py-2 rounded-xl flex items-center gap-2 z-10 font-black text-[10px] tracking-widest text-primary uppercase">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Freshly Stocked
                </div>
              )}
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Thumbnails */}
            {thumbnails.length > 1 && (
              <div className="flex gap-4 overflow-x-auto px-4 lg:px-0 no-scrollbar">
                {thumbnails.map((thumb, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-white border-2 overflow-hidden transition-all ${
                      activeImage === thumb ? 'border-primary shadow-lg scale-95' : 'border-gray-100'
                    }`}
                  >
                    <img src={thumb} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col px-4 lg:px-0">
            <div className="mb-6">
              <span className="text-accent text-[11px] font-black uppercase tracking-[0.3em] mb-4 block">
                {product.category}
              </span>
              <h1 className="text-[2rem] sm:text-[3rem] lg:text-[4.5rem] font-display font-black text-forest leading-[1.1] mb-6">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through font-bold">₹{product.originalPrice}</span>
                )}
                <div className="bg-accent text-white px-3 py-1 rounded-lg text-[10px] font-black">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </div>
            </div>

            <p className="text-gray-600 font-medium leading-relaxed mb-10 text-base sm:text-lg">
              {longDesc}
            </p>

            {/* Weight Selection */}
            <div className="mb-10">
              <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Select Pack Size</p>
              <div className="flex flex-wrap gap-3">
                {availableWeights.map(w => (
                  <button 
                    key={w.label}
                    onClick={() => setSelectedWeight(w.label)}
                    className={`px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-soft active:scale-95 ${
                      selectedWeight === w.label 
                        ? 'bg-forest text-white shadow-xl' 
                        : 'bg-white text-gray-500 border border-gray-100 hover:border-forest hover:text-forest'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            {!isMobile && (
              <div className="flex gap-4 mb-10">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-[1.5rem] px-2 w-40 h-16">
                  <button onClick={decreaseQty} className="p-3 text-gray-400 hover:text-primary"><Minus size={18} /></button>
                  <span className="font-black text-forest text-xl w-6 text-center">{quantity}</span>
                  <button onClick={increaseQty} className="p-3 text-gray-400 hover:text-primary"><Plus size={18} /></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white font-black text-lg h-16 rounded-[1.5rem] flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            )}

            <button 
              onClick={() => handleWhatsAppOrder()}
              className={`w-full flex items-center justify-center gap-3 text-primary border-2 border-primary/20 hover:bg-primary hover:text-white font-black uppercase tracking-widest text-xs h-16 rounded-[1.5rem] transition-all ${isMobile ? 'mb-10' : ''}`}
            >
              <Phone size={20} />
              WhatsApp Checkout
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
            {products.filter(p => (p._id || p.id) !== (product._id || product.id)).slice(0, 4).map(p => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
