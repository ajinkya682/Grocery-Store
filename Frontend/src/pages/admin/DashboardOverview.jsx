// src/pages/admin/DashboardOverview.jsx
import { useEffect, useState } from 'react';
import { mockService } from '../../api/mockService';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-dark">{value}</h3>
    </div>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [dashStats, recentOrders] = await Promise.all([
        mockService.getDashboardStats(),
        mockService.getOrders()
      ]);
      setStats(dashStats);
      setOrders(recentOrders.slice(0, 5)); // Just show recent 5
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={stats.revenueThisMonth} icon={DollarSign} color="bg-green-100 text-green-600" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="bg-orange-100 text-orange-600" />
        <StatCard title="Active Users" value={stats.activeUsers} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard title="Growth" value="+15.4%" icon={TrendingUp} color="bg-purple-100 text-purple-600" />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-dark">Recent Orders</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order, i) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 font-medium text-dark">{order.id}</td>
                    <td className="py-4 text-gray-600">{order.customer}</td>
                    <td className="py-4 text-gray-500 text-xs">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-right">₹{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-lg text-dark mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-forest text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all text-sm">
              + Add New Product
            </button>
            <button className="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary/20 transition-all text-sm">
              View Latest Orders
            </button>
            <button className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all text-sm">
              Store Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
