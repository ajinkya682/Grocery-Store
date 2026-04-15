// src/pages/admin/ManageOrders.jsx
import { useState, useEffect } from 'react';
import { ordersAPI } from '../../api/apiService';
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
import { useStore } from '../../context/StoreContext';

const ORDER_STATUSES = [
  { label: 'Pending', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Shipped', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
];

const OrderRow = ({ order, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const id = order._id || order.id;
  const customerName = order.user?.name || 'Guest';
  const orderNum = order.orderNumber || id;
  const orderDate = order.createdAt || order.date || new Date().toISOString();
  const total = order.pricing?.total ?? order.total ?? 0;
  const itemCount = order.items?.length ?? order.items ?? 0;
  const status = ORDER_STATUSES.find((s) => s.label === order.status) || ORDER_STATUSES[0];
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
               <p className="text-sm font-black text-slate-900">{orderNum}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order Ref</p>
             </div>
          </div>
        </td>
        <td className="py-6 px-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">
                {customerName.charAt(0).toUpperCase()}
             </div>
             <div>
               <p className="text-sm font-bold text-slate-700">{customerName}</p>
               {order.user?.email && <p className="text-[10px] text-slate-400 font-bold">{order.user.email}</p>}
             </div>
          </div>
        </td>
        <td className="py-6 px-6">
          <div className="flex flex-col">
             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Calendar size={12} className="text-slate-300" />
                {new Date(orderDate).toLocaleDateString()}
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                <Clock size={10} />
                {new Date(orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
          </div>
        </td>
        <td className="py-6 px-6 text-sm font-black text-slate-900">
           ₹{total.toLocaleString('en-IN')}
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{itemCount} items</p>
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
                         <a 
                           href={`https://wa.me/${(order.shippingAddress?.phone || order.user?.mobile || '').replace(/\D/g, '')}`}
                           target="_blank"
                           rel="noreferrer"
                           className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                         >
                            <Phone size={14} /> Contact via WhatsApp
                         </a>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</p>
                            <div className="space-y-3">
                               <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                  <User size={16} className="text-slate-300" /> {order.shippingAddress?.name || order.user?.name}
                               </div>
                               <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                  <Phone size={16} className="text-slate-300" /> {order.shippingAddress?.phone || order.user?.mobile || 'No Phone'}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Delivery Address</p>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed">
                               {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                               {order.shippingAddress?.landmark && <span className="block text-[10px] mt-1 text-slate-400">Landmark: {order.shippingAddress.landmark}</span>}
                            </p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Order Payload</h4>
                         <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                                       {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <Package size={20} />}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">₹{item.price} x {item.quantity}</p>
                                    </div>
                                 </div>
                                 <p className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</p>
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
                            {ORDER_STATUSES.map((s) => (
                               <button 
                                 key={s.label}
                                 onClick={(e) => { e.stopPropagation(); onStatusChange(id, s.label); }}
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
  const { storeSettings } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.getAll({ limit: 50 });
      setOrders(data.data.orders);
    } catch (err) {
      console.error('Orders fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await ordersAPI.updateStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filter === 'All' || o.status === filter;
    const searchStr = `${o.orderNumber || ''} ${o.user?.name || ''} ${o.user?.email || ''}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      alert("No data to export");
      return;
    }

    const storeName = storeSettings?.identity?.name || "Our Grocery Store";
    const dateStr = new Date().toLocaleDateString();
    
    // CSV Construction
    const headers = [
      "Order ID", "Date", "Time", "Customer", "Phone", "Weight/Unit", 
      "Items Detailed", "Subtotal", "Delivery", "Total", "Status", "Address"
    ];

    const rows = filteredOrders.map(o => {
      const orderDate = new Date(o.createdAt || o.date);
      const itemsList = (o.items || []).map(i => `${i.name} (${i.quantity}x)`).join("; ");
      const fullAddress = `"${(o.shippingAddress?.address || '').replace(/"/g, '""')}, ${(o.shippingAddress?.city || '').replace(/"/g, '""')} - ${o.shippingAddress?.pincode || ''}"`;
      
      return [
        o.orderNumber || o._id,
        orderDate.toLocaleDateString(),
        orderDate.toLocaleTimeString(),
        `"${(o.shippingAddress?.name || o.user?.name || 'Guest').replace(/"/g, '""')}"`,
        `"${o.shippingAddress?.phone || o.user?.mobile || 'N/A'}"`,
        `"${(o.items?.[0]?.weight || o.items?.[0]?.unit || 'Standard').replace(/"/g, '""')}"`,
        `"${itemsList.replace(/"/g, '""')}"`,
        o.pricing?.subtotal || o.total || 0,
        o.pricing?.deliveryFee || 0,
        o.pricing?.total || o.total || 0,
        o.status,
        fullAddress
      ];
    });

    const csvContent = [
      `"${storeName.replace(/"/g, '""')}"`,
      `"Order Export Report - ${dateStr}"`,
      "", // Spacing
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Create Blob with BOM for Excel UTF-8 support
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Orders_Export_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <button 
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            <Package size={18} /> Export Excel
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
              {filteredOrders.map((order) => (
                <OrderRow key={order._id} order={order} onStatusChange={updateOrderStatus} />
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
