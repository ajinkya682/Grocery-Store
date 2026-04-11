// src/pages/admin/ManageProducts.jsx
import { useState, useEffect, useMemo } from 'react';
import { useProduct } from '../../context/ProductContext';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ChevronDown, 
  ArrowUpDown, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  CheckSquare,
  Square,
  Package,
  Layers,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageProducts = () => {
  const { products, deleteProduct, addProduct, updateProduct, categories } = useProduct();
  
  // View/Filter/Sort State
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, In Stock, Low Stock, Out of Stock
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Selection/Bulk State
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('General'); // General, Inventory, Media
  
  // Form State
  const initialForm = {
    name: '', category: '', price: '', originalPrice: '', weight: '',
    image: '', thumb1: '', thumb2: '', 
    sku: '', stock: '', description: '', isOrganic: false, isFresh: false, inStock: true
  };
  const [form, setForm] = useState(initialForm);

  // --- Search Debounce ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // --- Filtering & Sorting ---
  const filteredAndSorted = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
                           (p.sku && p.sku.toLowerCase().includes(debouncedQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'In Stock') matchesStatus = p.stock > 10;
      if (statusFilter === 'Low Stock') matchesStatus = p.stock > 0 && p.stock <= 10;
      if (statusFilter === 'Out of Stock') matchesStatus = p.stock === 0;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, debouncedQuery, categoryFilter, statusFilter, sortConfig]);

  // --- Handlers ---
  const toggleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredAndSorted.length ? [] : filteredAndSorted.map(p => p.id));
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      selectedIds.forEach(id => deleteProduct(id));
      setSelectedIds([]);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        name: product.name,
        category: product.category || '',
        price: product.price,
        originalPrice: product.originalPrice || '',
        weight: product.weight || '',
        image: product.image || '',
        thumb1: product.thumbnails?.[1] || '',
        thumb2: product.thumbnails?.[2] || '',
        sku: product.sku || '',
        stock: product.stock,
        description: product.description || '',
        isOrganic: product.highlights?.some(h => h.includes('Organic')) || false,
        isFresh: product.isFresh || product.badge === 'Fresh' || false,
        inStock: product.inStock
      });
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setActiveTab('General');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const highlightsArr = [];
    if (form.isOrganic) highlightsArr.push('100% Organic');
    
    const thumbs = [form.image];
    if (form.thumb1) thumbs.push(form.thumb1);
    if (form.thumb2) thumbs.push(form.thumb2);

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/ /g, '-'),
      category: form.category || 'Miscellaneous',
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      weight: form.weight,
      image: form.image,
      thumbnails: thumbs,
      sku: form.sku,
      stock: Number(form.stock),
      inStock: Number(form.stock) > 0,
      description: form.description,
      highlights: highlightsArr,
      isFresh: form.isFresh,
      badge: form.isFresh ? 'Fresh' : ''
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct({ id: Date.now(), ...payload });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in relative text-slate-900 font-sans pb-20">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black">Catalog Management</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Manage your products, inventory, and pricing.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
            >
              <Trash2 size={16} /> Delete ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-forest transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[2.5rem] border border-slate-100 shadow-saas flex flex-col lg:flex-row gap-4 lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-5 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {['All', 'In Stock', 'Low', 'Out'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status === 'Low' ? 'Low Stock' : status === 'Out' ? 'Out of Stock' : status)}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  (statusFilter === status || (status === 'Low' && statusFilter === 'Low Stock') || (status === 'Out' && statusFilter === 'Out of Stock'))
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Products Grid / Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-saas overflow-hidden">
        {/* Table View (Desktop) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                <th className="py-6 px-8 w-12">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-primary transition-colors">
                    {selectedIds.length === filteredAndSorted.length && filteredAndSorted.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th 
                  className="py-6 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-2">Product <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-6 px-6">Category/SKU</th>
                <th 
                  className="py-6 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center gap-2">Price <ArrowUpDown size={12} /></div>
                </th>
                <th 
                  className="py-6 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => toggleSort('stock')}
                >
                  <div className="flex items-center gap-2">Inventory <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-bold">
              {filteredAndSorted.map(product => {
                const isSelected = selectedIds.includes(product.id);
                const isLow = product.stock > 0 && product.stock <= 10;
                const isOut = product.stock === 0;

                return (
                  <tr key={product.id} className={`group hover:bg-slate-50/50 transition-all ${isSelected ? 'bg-primary/5' : ''}`}>
                    <td className="py-5 px-8">
                      <button onClick={() => handleSelectOne(product.id)} className={`${isSelected ? 'text-primary' : 'text-slate-200 group-hover:text-slate-400'} transition-all`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100" alt="" />
                        <div>
                          <p className="text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{product.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-block bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-1">{product.category}</span>
                      <p className="text-[10px] text-slate-400 font-mono italic">{product.sku || 'NO-SKU'}</p>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-slate-900 text-base">₹{product.price}</p>
                      {product.originalPrice > product.price && <p className="text-[10px] text-slate-300 line-through">₹{product.originalPrice}</p>}
                    </td>
                    <td className="py-5 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        isOut ? 'bg-red-50 text-red-600' : isLow ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-600' : isLow ? 'bg-orange-600' : 'bg-green-600'} animate-pulse`} />
                        {isOut ? 'Out of Stock' : isLow ? `${product.stock} Low Stock` : `${product.stock} Units`}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card View (Mobile/Tablet) */}
        <div className="lg:hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredAndSorted.map(product => (
            <div key={product.id} className="bg-slate-50/50 rounded-[2rem] p-5 border border-slate-100 relative group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <img src={product.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                  <div>
                    <h4 className="font-black text-slate-900 line-clamp-1">{product.name}</h4>
                    <p className="text-xs font-bold text-slate-500">{product.category}</p>
                    <p className="text-lg font-black text-slate-900 mt-1">₹{product.price}</p>
                  </div>
                </div>
                <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-slate-900">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                   {product.stock} Units Available
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(product)} className="p-3 bg-white text-slate-500 rounded-xl shadow-sm"><Edit2 size={14} /></button>
                  <button onClick={() => deleteProduct(product.id)} className="p-3 bg-white text-red-500 rounded-xl shadow-sm"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
          <div className="py-24 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 font-bold text-sm max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
            <button 
              onClick={() => { setQuery(''); setStatusFilter('All'); setCategoryFilter('All'); }}
              className="mt-8 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Multi-Section Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm sm:p-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Refine Product' : 'Onboard New Product'}</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Catalog Entry #{editingId || 'New'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex px-10 pt-2 border-b border-slate-50">
                {[
                  { id: 'General', icon: Layers }, 
                  { id: 'Inventory', icon: Package }, 
                  { id: 'Media', icon: Search }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all ${
                      activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.id}
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                
                {/* Tab 1: General Info */}
                {activeTab === 'General' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Name *</label>
                        <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all placeholder:text-slate-300" placeholder="e.g. Organic Turmeric Powder" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category Group *</label>
                        <select required value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all">
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Branding Badge</label>
                        <select value={form.isFresh ? 'Fresh' : 'None'} onChange={(e)=>setForm({...form, isFresh: e.target.value === 'Fresh'})} className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all">
                          <option value="None">No Special Badge</option>
                          <option value="Fresh">"Fresh" Label</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Description</label>
                      <textarea rows="4" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all placeholder:text-slate-300" placeholder="Describe the origin, benefits, and usage..."></textarea>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: Inventory & Pricing */}
                {activeTab === 'Inventory' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Selling Price (₹) *</label>
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type="number" required value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="w-full pl-10 pr-4 py-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Comparison Price (MRP)</label>
                        <input type="number" value={form.originalPrice} onChange={(e)=>setForm({...form, originalPrice: e.target.value})} className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Available Stock Units *</label>
                        <input type="number" required value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Internal SKU</label>
                        <input type="text" value={form.sku} onChange={(e)=>setForm({...form, sku: e.target.value})} className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all uppercase" placeholder="e.g. MAS-TURM-250G" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Net Weight / Volume</label>
                        <input type="text" required value={form.weight} onChange={(e)=>setForm({...form, weight: e.target.value})} className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all" placeholder="e.g. 250 g, 1 Litre" />
                      </div>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 h-[60px] self-end">
                        <input type="checkbox" id="organic-check" checked={form.isOrganic} onChange={(e)=>setForm({...form, isOrganic: e.target.checked})} className="w-5 h-5 accent-primary rounded-lg" />
                        <label htmlFor="organic-check" className="text-sm font-black text-slate-700 cursor-pointer">100% Organic Certified</label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Media */}
                {activeTab === 'Media' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Visual Assets (URLs)</label>
                      <div className="space-y-3">
                        <input type="text" required value={form.image} onChange={(e)=>setForm({...form, image: e.target.value})} placeholder="Hero Image URL *" className="w-full p-4 text-xs font-bold bg-slate-50 border border-slate-100 rounded-2xl" />
                        <input type="text" value={form.thumb1} onChange={(e)=>setForm({...form, thumb1: e.target.value})} placeholder="Gallery Image 2" className="w-full p-4 text-xs font-bold bg-slate-50 border border-slate-100 rounded-2xl" />
                        <input type="text" value={form.thumb2} onChange={(e)=>setForm({...form, thumb2: e.target.value})} placeholder="Gallery Image 3" className="w-full p-4 text-xs font-bold bg-slate-50 border border-slate-100 rounded-2xl" />
                      </div>
                    </div>
                    
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                       <div className="flex gap-4 mb-4">
                         {form.image && <img src={form.image} className="w-20 h-20 rounded-2xl object-cover shadow-xl" alt="" />}
                         {form.thumb1 && <img src={form.thumb1} className="w-16 h-16 rounded-2xl object-cover opacity-50" alt="" />}
                         {form.thumb2 && <img src={form.thumb2} className="w-16 h-16 rounded-2xl object-cover opacity-50" alt="" />}
                       </div>
                       <p className="text-xs text-slate-400 font-bold max-w-xs">Previews are generated automatically after entering valid public URLs.</p>
                    </div>
                  </motion.div>
                )}

              </form>

              {/* Modal Footer */}
              <div className="px-10 py-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex gap-2">
                   {activeTab === 'Inventory' && <button onClick={() => setActiveTab('General')} className="px-6 py-3 font-black text-[10px] uppercase text-slate-400 hover:text-slate-900 transition-all tracking-widest">Back</button>}
                   {activeTab === 'Media' && <button onClick={() => setActiveTab('Inventory')} className="px-6 py-3 font-black text-[10px] uppercase text-slate-400 hover:text-slate-900 transition-all tracking-widest">Back</button>}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Discard</button>
                  {activeTab !== 'Media' ? (
                    <button 
                      type="button" 
                      onClick={() => setActiveTab(activeTab === 'General' ? 'Inventory' : 'Media')}
                      className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-white bg-slate-800 rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button type="submit" onClick={handleSave} className="px-10 py-4 font-black text-[10px] uppercase tracking-widest text-white bg-primary rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
                      {editingId ? 'Update & Deploy' : 'Finalize & Post'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;
