// src/pages/admin/ManageOrders.jsx
import { useState, useEffect } from 'react';
import { mockService } from '../../api/mockService';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Phone, 
  Calendar, 
  Clock, 
  User,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ORDER_STATUSES = [
  { label: 'Pending', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Shipped', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
];

const OrderRow = ({ order, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = ORDER_STATUSES.find(s => s.label === order.status) || ORDER_STATUSES[0];
  const StatusIcon = status.icon;

  return (
    <>
      <tr className={`group hover:bg-slate-50 transition-all cursor-pointer ${isExpanded ? 'bg-slate-50/80 shadow-inner' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
        <td className="py-6 px-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary transition-all">
                <ShoppingBag size={18} />
             </div>
             <div>
               <p className="text-sm font-black text-slate-900">{order.id}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order Ref</p>
             </div>
          </div>
        </td>
        <td className="py-6 px-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">
                {order.customer.charAt(0)}
             </div>
             <p className="text-sm font-bold text-slate-700">{order.customer}</p>
          </div>
        </td>
        <td className="py-6 px-6">
          <div className="flex flex-col">
             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Calendar size={12} className="text-slate-300" />
                {new Date(order.date).toLocaleDateString()}
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                <Clock size={10} />
                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
          </div>
        </td>
        <td className="py-6 px-6 text-sm font-black text-slate-900">
           ₹{order.total}
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{order.items} items</p>
        </td>
        <td className="py-6 px-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
             <StatusIcon size={14} />
             {order.status}
          </div>
        </td>
        <td className="py-6 px-8 text-right">
          <button className={`p-2.5 rounded-xl transition-all ${isExpanded ? 'bg-slate-900 text-white rotate-180' : 'text-slate-400 hover:bg-slate-200'}`}>
             <ChevronDown size={18} />
          </button>
        </td>
      </tr>

      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan="6" className="p-0 border-b border-slate-100">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white px-10 py-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                   {/* Left: Customer & Items */}
                   <div className="lg:col-span-8 space-y-8">
                      <div className="flex items-center justify-between">
                         <h4 className="text-lg font-black text-slate-900">Customer Intelligence</h4>
                         <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                            <Phone size={14} /> Contact via WhatsApp
                         </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</p>
                            <div className="space-y-3">
                               <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                  <User size={16} className="text-slate-300" /> {order.customer}
                               </div>
                               <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                  <Phone size={16} className="text-slate-300" /> +91 98765 43210
                               </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Delivery Address</p>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed">
                               Flat 402, Green Valley Apartments, Kolhapur, Maharashtra 416001
                            </p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Order Payload</h4>
                         <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300"><Package size={20} /></div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">Fresh Organic Turmeric Powder</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">250g Jar x 2</p>
                                    </div>
                                 </div>
                                 <p className="text-sm font-black text-slate-900">₹350</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right: Actions & Timeline */}
                   <div className="lg:col-span-4 space-y-8">
                      <div className="space-y-6">
                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Status Lifecycle</h4>
                         <div className="space-y-3">
                            {ORDER_STATUSES.map(s => (
                               <button 
                                 key={s.label}
                                 onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, s.label); }}
                                 className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                   order.status === s.label 
                                    ? s.bg + ' ' + s.color + ' border-2 border-current shadow-lg ring-4 ring-offset-2 ring-transparent' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border-2 border-transparent'
                                 }`}
                               >
                                  <div className="flex items-center gap-3">
                                     <s.icon size={18} />
                                     <span className="text-xs font-black uppercase tracking-widest">{s.label}</span>
                                  </div>
                                  {order.status === s.label && <CheckCircle2 size={16} />}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="p-6 bg-slate-950 rounded-[2rem] text-white">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Internal Notes</p>
                         <textarea 
                           placeholder="Add private staff notes..." 
                           className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs font-medium outline-none focus:border-primary/50 text-slate-300 h-24 mb-4"
                         ></textarea>
                         <button className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                            Save Annotations
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await mockService.getOrders();
    setOrders(res);
    setLoading(false);
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    // In real app, would call API here
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filter === 'All' || o.status === filter;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-white rounded-[2rem] animate-shimmer" />
        <div className="h-96 bg-white rounded-[2rem] animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Order Logs</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Track and manage customer checkout requests.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            <Package size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[2.5rem] border border-slate-100 shadow-saas flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl underline-none font-bold text-sm"
          />
        </div>
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
           {['All', ...ORDER_STATUSES.map(s => s.label)].map(s => (
             <button 
               key={s}
               onClick={() => setFilter(s)}
               className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-saas overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                <th className="py-6 px-8">Order</th>
                <th className="py-6 px-6">Customer</th>
                <th className="py-6 px-6">Date & Time</th>
                <th className="py-6 px-6">Total Value</th>
                <th className="py-6 px-6">Status</th>
                <th className="py-6 px-8 text-right">Expansion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map(order => (
                <OrderRow key={order.id} order={order} onStatusChange={updateOrderStatus} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-slate-300" />
             </div>
             <h3 className="text-xl font-black text-slate-900">No Orders Matched</h3>
             <p className="text-slate-500 font-bold text-sm mt-2">Adjust your filters or query to explore other orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
