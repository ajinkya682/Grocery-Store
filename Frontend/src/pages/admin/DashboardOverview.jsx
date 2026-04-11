// src/pages/admin/DashboardOverview.jsx
import { useEffect, useState } from 'react';
import { mockService } from '../../api/mockService';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Eye,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-saas hover:shadow-saas-xl transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
    </div>
  </motion.div>
);

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const res = await mockService.getDashboardStats();
      setData(res);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white rounded-[2rem] animate-shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white rounded-[3rem] animate-shimmer" />
          <div className="h-96 bg-white rounded-[3rem] animate-shimmer" />
        </div>
      </div>
    );
  }

  const COLORS = ['#064e3b', '#f59e0b', '#1e293b', '#64748b'];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Store Analytics</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Real-time overview of your grocery empire.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">
            <Plus size={18} /> Add Product
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
            <ShoppingBag size={18} /> Manage Orders
          </button>
        </div>
      </div>

      {/* 2. KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={data.totalRevenue} 
          icon={DollarSign} 
          color="bg-green-50 text-green-600" 
          trend="+14.2%" 
          trendUp={true} 
        />
        <StatCard 
          title="Total Products" 
          value={data.totalProducts} 
          icon={Package} 
          color="bg-indigo-50 text-indigo-600" 
          trend="+3 New" 
          trendUp={true} 
        />
        <StatCard 
          title="Active Orders" 
          value={data.activeOrders} 
          icon={ShoppingBag} 
          color="bg-orange-50 text-orange-600" 
          trend="-2.4%" 
          trendUp={false} 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={data.lowStockCount} 
          icon={AlertTriangle} 
          color="bg-red-50 text-red-600" 
          trend={data.lowStockCount > 10 ? "Critical" : "Manageable"} 
          trendUp={data.lowStockCount < 10} 
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend (Line Chart) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-saas">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Sales Trends</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Last 7 Days Performance</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-black px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 900
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#064e3b" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories (Bar Chart) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-saas">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-900">Revenue Split</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">By Product Category</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryRevenue} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#475569' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {data.categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Details Section (Top Products & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products Table */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-saas overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Top Selling Products</h3>
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  <th className="py-4 px-8">Product</th>
                  <th className="py-4 px-8">Sold</th>
                  <th className="py-4 px-8">Price</th>
                  <th className="py-4 px-8">Status</th>
                  <th className="py-4 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="" />
                        <div>
                          <p className="text-sm font-black text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <p className="text-sm font-black text-slate-700">{p.sales}</p>
                      <p className="text-[10px] text-green-500 font-black">{p.growth}</p>
                    </td>
                    <td className="py-5 px-8 font-black text-slate-900 text-sm">₹{p.price}</td>
                    <td className="py-5 px-8">
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-600' : 'bg-red-500'} animate-pulse`} />
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Checklist & Updates */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-saas">
            <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              {[
                { label: 'Update Stock Levels', icon: Package, color: 'primary' },
                { label: 'Verify Deliveries', icon: CheckCircle2, color: 'green-600' },
                { label: 'View Reports', icon: TrendingUp, color: 'blue-600' },
              ].map((act, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center text-${act.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <act.icon size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{act.label}</span>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <h3 className="text-lg font-black mb-2 relative z-10">Pro Integration</h3>
            <p className="text-slate-400 text-xs font-bold mb-6 leading-relaxed relative z-10">Connect your WhatsApp API to automate order confirmations and customer updates instantly.</p>
            <button className="w-full bg-white text-slate-950 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all relative z-10">
              Configure Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
