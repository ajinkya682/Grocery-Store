// src/pages/admin/ManageOrders.jsx
import { useEffect, useState } from 'react';
import { mockService } from '../../api/mockService';
import { Search, Eye, Download } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await mockService.getOrders();
      setOrders(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <h2 className="font-bold text-lg text-dark pl-2">Order History</h2>
        <div className="flex gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Order ID</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Customer</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Amount</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-dark">{order.id}</td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {new Date(order.date).toLocaleDateString()}<br/>
                      <span className="text-[10px]">{new Date(order.date).toLocaleTimeString()}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{order.customer}</td>
                    <td className="py-4 px-6">
                      <select 
                        title="Update Status"
                        className={`text-[11px] font-bold uppercase outline-none bg-transparent cursor-pointer 
                        ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Processing' ? 'text-orange-500' : 'text-gray-600'}`}
                      >
                        <option value={order.status}>{order.status}</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 font-bold text-dark w-32">₹{order.total}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
