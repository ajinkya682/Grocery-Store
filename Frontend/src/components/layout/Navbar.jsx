// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Phone } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";
import { useProduct } from "../../context/ProductContext";

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

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { totalItems, orderViaWhatsApp, cartItems } = useCart();
  const { products } = useProduct();
  const { storeSettings } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const handleCheckoutClick = () => {
    // Requirements: We must be select at least one item to order on WhatsApp
    if (totalItems === 0 || cartItems.length === 0) {
      alert("Uh oh! Your cart is empty. Please add at least one item to order.");
    } else {
      orderViaWhatsApp();
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
    setShowSuggestions(false);
    setQuery("");
  }, [location]);

  return (
    <>
      {/* Top strip */}
      <div className="hidden md:flex items-center justify-between bg-forest text-white text-xs px-6 py-1.5 font-sans">
        <span className="flex items-center gap-1.5">
          <Phone size={11} className="text-saffron-400" />
          Order via WhatsApp:{" "}
          <strong className="text-saffron-300">{storeSettings?.contact?.phone || '+91 98765 43210'}</strong>
        </span>
        <span className="text-gray-300">
          Free delivery on orders above ₹{storeSettings?.delivery?.freeDeliveryMinOrder || 499}
          {storeSettings?.delivery?.sameDayDelivery && ' • Same-day delivery available'}
        </span>
      </div>

      {/* Main navbar */}
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 font-sans
          ${scrolled ? "shadow-md py-3" : "py-4"}
        `}
      >
        <div className="relative max-w-7xl mx-auto px-6 flex items-center h-10">
          {/* Logo */}
          <Link
            to="/"
            id="nav-logo"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-forest flex items-center justify-center shadow-green group-hover:scale-105 transition-transform duration-200">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[14px] font-black font-display text-forest tracking-tight">
                {storeSettings?.identity?.name || 'Grocery Store'}
              </p>
              <p className="text-[9px] text-saffron-500 font-bold uppercase tracking-[0.2em]">
                {storeSettings?.identity?.tagline || 'Fresh & Pure'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav — absolutely centered */}
          <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`
                  relative text-sm font-semibold transition-all duration-200 hover-underline pb-1
                  ${
                    location.pathname === link.path
                      ? "text-primary font-bold after:w-full"
                      : "text-gray-600 hover:text-primary"
                  }
                `}
              >
                {link.label}
                {link.isNew && (
                  <span className="absolute -top-3 -right-2 bg-accent text-[8px] text-white px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Desktop search bar */}
            <div ref={searchContainerRef} className="hidden md:flex flex-col relative z-50">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-primary-400 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 bg-gray-50 focus-within:bg-white transition-all duration-200">
                <SearchIcon />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search harvest…"
                  className="text-xs font-semibold text-gray-700 placeholder-gray-400 outline-none w-32 bg-transparent"
                />
              </div>

              {/* Suggestions Dropdown Desktop */}
              {showSuggestions && query.trim() !== '' && (
                <div className="absolute top-12 right-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden py-2 animate-fade-in">
                  {suggestions.length > 0 ? (
                    suggestions.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img src={item.image} alt="" className="w-8 h-8 rounded-md object-cover bg-gray-100" />
                        <div>
                          <p className="text-xs font-bold text-dark truncate whitespace-nowrap overflow-hidden max-w-[150px]">{item.name}</p>
                          <p className="text-[10px] font-semibold text-gray-400">{item.weight}</p>
                        </div>
                        <p className="ml-auto text-xs font-bold text-primary">₹{item.price}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs font-medium text-gray-500 text-center">No products found.</div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              id="nav-cart"
              className="relative p-2.5 rounded-full hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-all duration-200"
              aria-label="Cart"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-on-add">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* WhatsApp CTA — desktop only */}
            <button
              id="nav-whatsapp"
              onClick={handleCheckoutClick}
              className="hidden lg:flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-soft hover:scale-105 transition-all text-sm font-bold active:scale-95"
            >
              <WhatsAppIcon />
              Order on WhatsApp
            </button>

            {/* Mobile: search toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>

            {/* Mobile: animated hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-300 origin-center
                  ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-300
                  ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-300 origin-center
                  ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile slide-down search bar */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 relative bg-gray-50
            ${searchOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex items-center gap-3 px-6 py-3 border-t border-b border-gray-200">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              autoFocus={searchOpen}
              placeholder="Search for rice, dal, masala…"
              className="flex-1 text-sm font-semibold text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          {/* Mobile suggestions */}
          {query.trim() !== '' && (
            <div className="px-2 py-2 max-h-[200px] overflow-y-auto">
              {suggestions.length > 0 ? (
                    suggestions.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-white rounded-xl cursor-pointer transition-colors"
                      >
                        <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                        <div>
                          <p className="text-sm font-bold text-dark truncate whitespace-nowrap overflow-hidden max-w-[200px]">{item.name}</p>
                          <p className="text-xs font-semibold text-gray-400">{item.weight}</p>
                        </div>
                        <p className="ml-auto text-sm font-bold text-primary">₹{item.price}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-sm font-medium text-gray-500 text-center">No products found for '{query}'</div>
                  )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl font-sans
          flex flex-col pt-6 pb-8 px-6 gap-2
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <ul className="flex flex-col gap-1 mt-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`
                  block px-4 py-3 rounded-xl text-sm font-bold transition-colors
                  ${
                    location.pathname === link.path
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckoutClick}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-accent text-white px-5 py-3 rounded-xl shadow-soft text-sm font-bold active:scale-95 transition-all"
        >
          <WhatsAppIcon />
          Order on WhatsApp
        </button>
      </div>

      {/* Backdrop overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
