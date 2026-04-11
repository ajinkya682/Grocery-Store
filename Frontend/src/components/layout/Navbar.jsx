// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Phone, User, Search as SearchIcon, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";
import { useProduct } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { STORE_NAME } from "../../config/constants";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Our Masalas", path: "/our-masalas", isNew: true },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
];

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const Navbar = ({ isMobile }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { totalItems, openCart, orderViaWhatsApp } = useCart();
  const { products } = useProduct();
  const { storeSettings } = useStore();
  const { isUserAuthenticated, currentUser, logoutUser } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      const s = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      ).slice(0, 5);
      setSuggestions(s);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, products]);

  const handleSearchSubmit = (e) => {
    if ((e.key === "Enter" || e.type === "click") && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const handleCartClick = () => {
    if (!isUserAuthenticated) {
      navigate('/userlogin', { state: { from: location.pathname } });
    } else {
      openCart();
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-[100] transition-all duration-300 border-b
        ${scrolled ? "nav-scrolled py-2" : "bg-white py-4 border-gray-100"}
      `}
    >
      <div className="container-custom flex items-center justify-between h-10">
        {/* Logo Section */}
        <Link
          to="/"
          id="nav-logo"
          className="flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-forest flex items-center justify-center shadow-green group-hover:rotate-6 transition-all">
            <Leaf size={20} className="text-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <h1 className="text-lg font-black font-display text-forest tracking-tighter">
              {storeSettings?.identity?.name || STORE_NAME}
            </h1>
            <p className="text-[10px] text-accent font-bold uppercase tracking-widest">
              {storeSettings?.identity?.tagline || 'Nature\'s Purest'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Link - Hidden on Mobile */}
        {!isMobile && (
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm font-bold transition-all relative py-1
                  ${location.pathname === link.path ? "text-primary" : "text-gray-500 hover:text-primary"}
                `}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop/Mobile Common Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Search */}
          {!isMobile && (
            <div ref={searchContainerRef} className="relative hidden md:block">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 focus-within:bg-white focus-within:border-primary/30 transition-all w-64">
                <SearchIcon size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search products..."
                  className="bg-transparent outline-none text-xs font-bold text-gray-700 w-full"
                />
              </div>
              
              {/* Desktop Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-12 left-0 right-0 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden py-2"
                  >
                    {suggestions.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => { navigate(`/product/${item.id}`); setShowSuggestions(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-dark truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400">{item.weight}</p>
                        </div>
                        <p className="text-xs font-bold text-primary">₹{item.price}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Cart Icon - Visible on Desktop only (Mobile has it in bottom nav) */}
          {!isMobile && (
            <button
              onClick={handleCartClick}
              className="relative p-2.5 rounded-full hover:bg-gray-50 text-gray-700 transition-all hover:scale-110"
            >
              <CartIcon />
              {totalItems > 0 && isUserAuthenticated && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Login (Desktop) */}
          {!isMobile && (
            <div className="hidden sm:block">
              {isUserAuthenticated ? (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                  <div className="text-right hidden xl:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Welcome</p>
                    <p className="text-xs font-bold text-forest">{currentUser.name.split(' ')[0]}</p>
                  </div>
                  <button 
                    onClick={logoutUser}
                    className="w-10 h-10 rounded-2xl bg-forest/5 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-all"
                  >
                    <User size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/userlogin" className="btn-secondary py-2.5 px-6 border-forest/20">
                  Login
                </Link>
              )}
            </div>
          )}

          {/* Search Toggle (Mobile Only) */}
          {isMobile && (
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-2xl bg-gray-50 text-gray-700 active:scale-90 transition-all"
            >
              {searchOpen ? <CloseIcon size={20} /> : <SearchIcon size={20} />}
            </button>
          )}

          {/* Mobile Profile Toggle */}
          {isMobile && (
            <Link 
              to={isUserAuthenticated ? "#" : "/userlogin"} 
              onClick={isUserAuthenticated ? logoutUser : null}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isUserAuthenticated ? 'bg-forest text-white' : 'bg-gray-50 text-gray-600'}`}
            >
              <User size={20} />
            </Link>
          )}

          {/* Desktop WhatsApp CTA */}
          {!isMobile && (
            <button
              onClick={() => orderViaWhatsApp()}
              className="btn-primary"
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-t border-gray-50"
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
                <SearchIcon size={18} />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="What are you looking for?"
                  className="bg-transparent outline-none text-sm font-bold text-gray-700 w-full"
                />
              </div>
              {/* Mobile suggestions */}
              {suggestions.length > 0 && query.trim() !== '' && (
                <div className="mt-4 space-y-3">
                  {suggestions.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => { navigate(`/product/${item.id}`); setSearchOpen(false); }}
                      className="flex items-center gap-4 p-2 bg-gray-50/50 rounded-2xl"
                    >
                      <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-dark">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.weight} • ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
