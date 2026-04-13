// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ExternalLink,
  Search,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-200',
    'Processing': 'bg-blue-50 text-blue-600 border-blue-200',
    'Shipped': 'bg-purple-50 text-purple-600 border-purple-200',
    'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Cancelled': 'bg-red-50 text-red-600 border-red-200',
  };

  const icons = {
    'Pending': <Clock size={12} />,
    'Processing': <Package size={12} />,
    'Shipped': <Truck size={12} />,
    'Delivered': <CheckCircle2 size={12} />,
    'Cancelled': <XCircle size={12} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.div 
      layout
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Order #{order.orderNumber.split('-').pop()}</p>
              <h4 className="text-sm font-bold text-dark flex items-center gap-2">
                {date}
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                ₹{order.pricing.total}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
            >
              <ChevronRight size={18} />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-hidden">
          {order.items.slice(0, 3).map((item, idx) => (
            <img 
              key={idx} 
              src={item.image || '/placeholder-grocery.png'} 
              alt={item.name} 
              className="w-10 h-10 rounded-xl object-cover border border-gray-50"
            />
          ))}
          {order.items.length > 3 && (
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100 italic">
              +{order.items.length - 3}
            </div>
          )}
          <p className="ml-2 text-xs font-medium text-gray-500">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-50 bg-gray-50/30 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Items List */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Order Details</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-gray-100/50">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-dark">{item.name}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-forest">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100/50 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin size={14} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Shipping Address</p>
                  </div>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">
                    {order.shippingAddress.name}<br/>
                    {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100/50 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <CreditCard size={14} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Payment Info</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-600">Method: {order.paymentMethod}</p>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{order.paymentStatus}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-xs font-bold text-dark">Total Amount</p>
                    <p className="text-sm font-black text-forest">₹{order.pricing.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isUserAuthenticated } = useAuth();

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getMyOrders();
        setOrders(data.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isUserAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-forest/10 border-t-forest rounded-full animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading History...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20">
      <div className="container-custom max-w-4xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} /> Back to shopping
            </Link>
            <h1 className="text-4xl font-display font-black text-dark mb-2">My Orders</h1>
            <p className="text-gray-500 font-bold">Manage and track your heritage orders</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-right">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                <p className="text-2xl font-black text-forest">{orders.length}</p>
             </div>
             <div className="w-[1px] h-10 bg-gray-100" />
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rewards Point</p>
                <p className="text-2xl font-black text-accent">{orders.length * 10}</p>
             </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-dashed border-gray-100 rounded-[40px] p-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-forest/5 flex items-center justify-center text-forest mx-auto mb-8">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-display font-black text-dark mb-3">No orders yet</h3>
            <p className="text-gray-400 font-bold mb-10 max-w-xs mx-auto">Looks like you haven't placed any orders. Start your journey with our fresh masalas today!</p>
            <Link to="/products" className="btn-primary px-10 py-5">
               Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
