// src/components/layout/BottomNavigation.jsx
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Shop', path: '/products', icon: Grid },
  { label: 'Cart', path: '/cart', icon: ShoppingCart, isCart: true },
  { label: 'Orders', path: '/orders', icon: ClipboardList },
];

const BottomNavigation = () => {
  const location = useLocation();
  const { totalItems, openCart } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 py-2 px-4 flex justify-between items-center z-[100] lg:hidden safe-area-inset-bottom shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        if (item.isCart) {
          return (
            <button
              key={item.path}
              onClick={openCart}
              className="group flex flex-col items-center justify-center flex-1 relative py-1 outline-none"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className="p-1.5 rounded-xl transition-colors duration-300 text-gray-400 group-hover:text-primary/70"
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={2} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </div>
              </motion.div>
              <span className="text-[10px] font-bold tracking-tight transition-colors duration-300 text-gray-400">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className="group flex flex-col items-center justify-center flex-1 relative py-1"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              className={`p-1.5 rounded-xl transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary/70'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.isCart && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
            </motion.div>
            <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute -top-2 w-8 h-1 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
