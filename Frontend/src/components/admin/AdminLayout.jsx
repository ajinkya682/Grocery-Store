// src/components/admin/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PackageSearch, 
  ClipboardList, 
  Settings, 
  Store, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const SidebarItem = ({ item, isCollapsed, isActive }) => {
  const Icon = item.icon;
  
  return (
    <Link 
      to={item.path}
      className={`
        relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
        ${isActive 
          ? 'bg-primary text-white shadow-saas-xl' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }
      `}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Icon size={20} />
      </div>
      
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold text-sm whitespace-nowrap"
        >
          {item.label}
        </motion.span>
      )}

      {/* Tooltip for Collapsed State */}
      {isCollapsed && (
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl">
          {item.label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      )}

      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full"
        />
      )}
    </Link>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    return saved === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: PackageSearch },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* --- Sidebar (Desktop) --- */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col bg-slate-950 text-white relative z-50 shadow-2xl border-r border-slate-800"
      >
        {/* Sidebar Header */}
        <div className={`p-6 border-b border-slate-800 flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <Store size={22} className="text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <h1 className="font-black text-xs uppercase tracking-[0.2em]">SaaS Admin</h1>
              <p className="text-[10px] text-slate-500 font-bold">Manager v2.0</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path} 
              item={item} 
              isCollapsed={isCollapsed} 
              isActive={location.pathname === item.path} 
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={toggleSidebar}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <><PanelLeftClose size={20} /> <span className="text-sm font-bold">Collapse Menu</span></>}
          </button>
          
          <Link 
            to="/" 
            className={`mt-2 w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-bold">Exit Admin</span>}
          </Link>
        </div>
      </motion.aside>

      {/* --- Mobile Sidebar Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- Main Content Wrapper --- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        
        {/* --- Top Header (Sticky) --- */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <PanelLeftOpen size={22} />
            </button>
            
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl w-64 lg:w-96 focus-within:bg-white focus-within:border-primary/30 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search metrics, orders..." 
                className="bg-transparent outline-none text-sm font-bold text-slate-600 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900">Admin Staff</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Store Owner</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20">
                A
              </div>
            </div>
          </div>
        </header>

        {/* --- Dynamic Content Area --- */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- Mobile Drawer (Separate) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-slate-950 z-[110] shadow-2xl flex flex-col lg:hidden"
          >
            <div className="p-8 border-b border-slate-800">
              <Store size={32} className="text-primary mb-4" />
              <h2 className="text-white text-xl font-black">Admin Panel</h2>
              <p className="text-slate-500 text-xs mt-1">SaaS Management System</p>
            </div>
            <nav className="flex-1 p-6 space-y-2">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-6">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10">
                <LogOut size={20} /> Exit Admin
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
