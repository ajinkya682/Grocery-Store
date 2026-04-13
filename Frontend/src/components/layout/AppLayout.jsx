// src/components/layout/AppLayout.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';
import AdaptiveCart from '../ui/AdaptiveCart';
import { AnimatePresence, motion } from 'framer-motion';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1025);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Auth pages are fullscreen standalone — hide Navbar / Footer / BottomNav
  const isStandalonePage = ['/login', '/forgot-pin', '/adminlogin'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Global Header - adapts internally */}
      {!isStandalonePage && <Navbar isMobile={isMobile} />}

      {/* Main Content Area */}
      <main className={`flex-grow transition-all duration-300 ${isMobile ? 'pb-24' : 'pb-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer - only on desktop or specific pages */}
      {!isStandalonePage && !isMobile && <Footer />}

      {/* Cart Overlay (Bottom Sheet / Drawer) */}
      <AdaptiveCart />

      {/* Mobile-only Bottom Navigation */}
      {!isStandalonePage && isMobile && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
