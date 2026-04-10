// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Search, Menu, X, Leaf, Phone, ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { label: 'Home',          path: '/' },
  { label: 'Rice & Grains', path: '/products?category=rice-grains' },
  { label: 'Products',      path: '/products' },
  { label: 'Contact',       path: '/contact' },
];

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [query,       setQuery]       = useState('');
  const { totalItems, orderViaWhatsApp } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      {/* Top strip */}
      <div className="hidden md:flex items-center justify-between bg-forest text-white text-xs px-6 py-1.5">
        <span className="flex items-center gap-1.5">
          <Phone size={11} className="text-saffron-400" />
          Order via WhatsApp: <strong className="text-saffron-300">+91 98765 43210</strong>
        </span>
        <span className="text-gray-300">Free delivery on orders above ₹499 • Same-day delivery available</span>
      </div>

      {/* Main navbar */}
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/95 nav-scrolled py-3'
            : 'bg-white border-b border-gray-100 py-4'
          }
        `}
      >
        <div className="container-custom flex items-center gap-4">
          {/* Logo */}
          <Link to="/" id="nav-logo" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-forest flex items-center justify-center shadow-green group-hover:scale-105 transition-transform duration-200">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-black text-forest tracking-tight">Grocery Store</p>
              <p className="text-[9px] text-saffron-500 font-semibold uppercase tracking-widest">Fresh & Pure</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 mx-auto">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${location.pathname === link.path
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:text-forest hover:bg-gray-50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0 flex-shrink-0">
            {/* Search toggle */}
            <button
              id="search-toggle"
              onClick={() => setSearchOpen(o => !o)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all duration-200 text-sm"
              aria-label="Search"
            >
              <Search size={15} />
              <span className="text-xs text-gray-400 w-28">Search products…</span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              id="nav-cart"
              className="relative p-2.5 rounded-full hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-on-add">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* WhatsApp CTA */}
            <button
              id="nav-whatsapp"
              onClick={orderViaWhatsApp}
              className="hidden md:flex btn-green text-sm px-4 py-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Order on WhatsApp
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100
            ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="container-custom py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${location.pathname === link.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={orderViaWhatsApp}
              className="btn-whatsapp mt-2 justify-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Order on WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for rice, dal, masala…"
                className="flex-1 text-gray-800 placeholder-gray-400 outline-none text-base"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={18} className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
