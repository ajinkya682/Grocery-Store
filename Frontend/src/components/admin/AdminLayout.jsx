// src/components/admin/AdminLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ClipboardList, Settings, Store, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: PackageSearch },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-forest text-white flex flex-col shadow-xl flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Store size={18} className="text-saffron-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-widest uppercase">Admin Panel</h2>
            <p className="text-[10px] text-gray-400">Store Management</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md cursor-default' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-saffron-400' : 'text-gray-400'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <LogOut size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 max-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-dark font-display">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard Overview'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-sm">
                A
              </span>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-dark">Admin User</p>
                <p className="text-[10px] text-gray-500">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Portal */}
        <div className="p-8 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
