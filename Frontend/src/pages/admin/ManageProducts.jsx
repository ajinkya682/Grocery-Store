// src/pages/admin/ManageProducts.jsx
import { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { Search, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

const ManageProducts = () => {
  const { products, deleteProduct, addProduct, updateProduct, categories } = useProduct();
  const [query, setQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const initialForm = {
    name: '', category: '', price: '', originalPrice: '', weight: '',
    image: '', thumb1: '', thumb2: '', 
    sku: '', stock: '', description: '', isOrganic: false, isFresh: false, inStock: true
  };
  const [form, setForm] = useState(initialForm);

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

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
        thumb1: product.thumbnails?.[0] || '',
        thumb2: product.thumbnails?.[1] || '',
        sku: product.sku || '',
        stock: product.stock,
        description: product.description || '',
        isOrganic: product.highlights?.includes('100% Organic') || false,
        isFresh: product.isFresh || product.badge === 'Fresh' || false,
        inStock: product.inStock
      });
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const highlightsArr = [];
    if (form.isOrganic) highlightsArr.push('100% Organic');
    
    // Process thumbnails
    const thumbs = [];
    if (form.image) thumbs.push(form.image);
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
      inStock: form.inStock && Number(form.stock) > 0,
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
    <div className="space-y-6 animate-fade-in relative text-dark font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-forest transition-colors shadow-solid whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-widest font-bold">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category/SKU</th>
                <th className="py-4 px-6">Pricing</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 font-medium">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm" alt="" />
                      <div>
                        <p className="font-bold text-dark">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{product.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-block bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase mb-1">{product.category}</span>
                    <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                  </td>
                  <td className="py-3 px-6">
                    <p className="font-bold text-dark text-base">₹{product.price}</p>
                    {product.originalPrice && <p className="text-xs text-gray-400 line-through">₹{product.originalPrice}</p>}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                      product.stock > 20 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-saffron-50 text-saffron-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay Component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold font-display">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-bold mb-3">Product Images (URLs)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <input type="text" required value={form.image} onChange={(e)=>setForm({...form, image: e.target.value})} placeholder="Main Image URL *" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div>
                    <input type="text" value={form.thumb1} onChange={(e)=>setForm({...form, thumb1: e.target.value})} placeholder="Optional Image URL 2" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div>
                    <input type="text" value={form.thumb2} onChange={(e)=>setForm({...form, thumb2: e.target.value})} placeholder="Optional Image URL 3" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Product Name *</label>
                  <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Category *</label>
                  <input type="text" required list="categories" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  <datalist id="categories">
                    {categories.map((c, i) => <option key={i} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Selling Price (₹) *</label>
                  <input type="number" required value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e)=>setForm({...form, originalPrice: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Net Weight/Volume *</label>
                  <input type="text" required placeholder="e.g. 500g, 1L" value={form.weight} onChange={(e)=>setForm({...form, weight: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">SKU Code</label>
                  <input type="text" value={form.sku} onChange={(e)=>setForm({...form, sku: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase" />
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-bold mb-2">Full Description</label>
                <textarea rows="3" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"></textarea>
              </div>

              {/* Status & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-sm font-bold mb-2">Stock Available *</label>
                  <input type="number" required value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                
                <div className="flex flex-col justify-center space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isOrganic} onChange={(e)=>setForm({...form, isOrganic: e.target.checked})} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                    <span className="text-sm font-bold">Mark as 100% Organic</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isFresh} onChange={(e)=>setForm({...form, isFresh: e.target.checked})} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                    <span className="text-sm font-bold">Highlight as Fresh Item</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-primary hover:bg-forest shadow-solid rounded-xl transition-all">
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
