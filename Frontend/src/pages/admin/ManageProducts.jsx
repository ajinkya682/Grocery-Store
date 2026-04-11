// src/pages/admin/ManageProducts.jsx
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useProduct } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { optimizeImages } from '../../utils/imageOptimizer';
import { uploadAPI } from '../../api/apiService';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  CheckSquare,
  Square,
  Package,
  Layers,
  DollarSign,
  Upload,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FILES = 5;

// ─── Image Drop Zone Component ────────────────────────────────────────────────
const ImageDropZone = ({ uploadedImages, onImagesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const valid = [];
    const errors = [];
    for (const f of files) {
      if (uploadedImages.length + valid.length >= MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} images allowed`);
        break;
      } else {
        valid.push(f);
      }
    }
    return { valid, errors };
  };

  const { showToast } = useCart();

  const handleUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    const { valid, errors } = validateFiles(Array.from(files));

    if (errors.length > 0) {
      setError(errors[0]);
      showToast(errors[0], 'error');
      return;
    }
    if (valid.length === 0) return;

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Instant Preview (Temporary optimization feedback)
      // (Optional: show previews instantly with URIs while uploading)

      // 2. Client-side Multi-Image Optimization
      const optimizedFiles = await optimizeImages(valid, { maxWidth: 800, quality: 0.7 });

      // 3. Upload Optimized Files to Backend
      const { data } = await uploadAPI.uploadImages(optimizedFiles, (progress) => {
        setUploadProgress(progress);
      });
      
      onImagesChange([...uploadedImages, ...data.data]);
      showToast(`${optimizedFiles.length} images uploaded successfully`, 'success');
    } catch (err) {
      console.error('Products Imagekit Upload Error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      showToast('Upload failed. Please check your connection.', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImages, onImagesChange, showToast]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const removeImage = (index) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-[2rem] p-10 cursor-pointer transition-all duration-300
          flex flex-col items-center justify-center text-center min-h-[200px]
          ${isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
          }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 size={36} className="text-primary animate-spin" />
              <p className="text-sm font-bold text-slate-600">Uploading to ImageKit…</p>
              <div className="w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <p className="text-xs text-slate-400 font-bold">{uploadProgress}%</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                <ImagePlus size={28} />
              </div>
              <div>
                <p className="font-black text-slate-700 text-sm">
                  {isDragging ? 'Drop your images here!' : 'Drag & drop images here'}
                </p>
                <p className="text-xs text-slate-400 font-bold mt-1">
                  or <span className="text-primary underline">click to browse</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                JPG, PNG, WEBP · Max 2MB · Up to {MAX_FILES} images
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl px-4 py-3"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Previews */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {uploadedImages.map((img, i) => (
            <motion.div
              key={img.fileId || img.url || i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <img
                src={img.url}
                alt={`Product ${i + 1}`}
                className="w-full aspect-square object-cover rounded-2xl border border-slate-100 shadow-sm"
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-lg">
                  Main
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Toast Notification ───────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageProducts = () => {
  const { products, deleteProduct, addProduct, updateProduct, categories, addCategory } = useProduct();

  // View/Filter/Sort State
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Selection/Bulk State
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('General');
  const [saving, setSaving] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const PREDEFINED_UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'pack'];
  const SUGGESTED_TAGS = ['Best Seller', 'New', 'Organic', 'Local Product', 'Discount'];

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form State
  const initialForm = {
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    unit: 'pcs',
    stock: '',
    description: '',
    isFeatured: false,
    tags: [],
    images: [], // [{ url, fileId }]
  };
  const [form, setForm] = useState(initialForm);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filtering & Sorting
  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(debouncedQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'In Stock') matchesStatus = p.stock > 10;
      if (statusFilter === 'Low Stock') matchesStatus = p.stock > 0 && p.stock <= 10;
      if (statusFilter === 'Out') matchesStatus = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, debouncedQuery, categoryFilter, statusFilter, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getId = (p) => p._id || p.id;

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredAndSorted.length
        ? []
        : filteredAndSorted.map((p) => getId(p))
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} products?`)) return;
    for (const id of selectedIds) {
      await deleteProduct(id);
    }
    setSelectedIds([]);
    showToast(`${selectedIds.length} products deleted`);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(getId(product));
      setForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price ?? '',
        originalPrice: product.originalPrice ?? '',
        unit: product.unit || 'pcs',
        stock: product.stock ?? '',
        description: product.description || '',
        isFeatured: product.isFeatured || false,
        tags: product.tags || [],
        images: product.images || [],
      });
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setActiveTab('General');
    setShowNewCategory(false);
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price || form.stock === '') {
      showToast('Please fill in all required fields', 'error');
      setActiveTab('General');
      return;
    }

    if (showNewCategory && form.category) {
      await addCategory(form.category);
    }

    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      unit: form.unit,
      stock: Number(form.stock),
      description: form.description,
      isFeatured: form.isFeatured,
      tags: form.tags,
      images: form.images,
    };

    let result;
    if (editingId) {
      result = await updateProduct(editingId, payload);
    } else {
      result = await addProduct(payload);
    }

    setSaving(false);

    if (result?.success) {
      setIsModalOpen(false);
      showToast(editingId ? 'Product updated!' : 'Product created!');
    } else {
      showToast(result?.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const result = await deleteProduct(id);
    if (result?.success) {
      showToast(`"${name}" deleted`);
    } else {
      showToast(result?.message || 'Delete failed', 'error');
    }
  };

  const stockBadge = (stock) => {
    if (stock === 0) return { cls: 'bg-red-50 text-red-600', dot: 'bg-red-600', label: 'Out of Stock' };
    if (stock <= 10) return { cls: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600', label: `${stock} Low` };
    return { cls: 'bg-green-50 text-green-600', dot: 'bg-green-600', label: `${stock} Units` };
  };

  const addTag = (newTag) => {
    const trimmed = newTag.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm({ ...form, tags: [...form.tags, trimmed] });
    }
  };
  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="space-y-8 animate-fade-in relative text-slate-900 font-sans pb-20">

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black">Catalog Management</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Manage your products, inventory, and images.</p>
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

      {/* 2. Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-[2.5rem] border border-slate-100 shadow-saas flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-bold"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-5 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {['All', 'In Stock', 'Low', 'Out'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s === 'Low' ? 'Low Stock' : s)}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === s || (s === 'Low' && statusFilter === 'Low Stock')
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Products Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-saas overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                <th className="py-6 px-8 w-12">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-primary transition-colors">
                    {selectedIds.length === filteredAndSorted.length && filteredAndSorted.length > 0
                      ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th className="py-6 px-6 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-2">Product <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-6 px-6">Category</th>
                <th className="py-6 px-6 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('price')}>
                  <div className="flex items-center gap-2">Price <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-6 px-6 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('stock')}>
                  <div className="flex items-center gap-2">Inventory <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-bold">
              {filteredAndSorted.map((product) => {
                const id = getId(product);
                const isSelected = selectedIds.includes(id);
                const badge = stockBadge(product.stock);
                const imgSrc = product.images?.[0]?.url || product.image || '';

                return (
                  <tr key={id} className={`group hover:bg-slate-50/50 transition-all ${isSelected ? 'bg-primary/5' : ''}`}>
                    <td className="py-5 px-8">
                      <button onClick={() => handleSelectOne(id)} className={`${isSelected ? 'text-primary' : 'text-slate-200 group-hover:text-slate-400'} transition-all`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        {imgSrc
                          ? <img src={imgSrc} className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100" alt="" />
                          : <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center"><Package size={20} className="text-slate-300" /></div>
                        }
                        <div>
                          <p className="text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-block bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-slate-900 text-base">₹{product.price}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-[10px] text-slate-300 line-through">₹{product.originalPrice}</p>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${badge.cls}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
                        {badge.label}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(id, product.name)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredAndSorted.map((product) => {
            const id = getId(product);
            const imgSrc = product.images?.[0]?.url || product.image || '';
            const badge = stockBadge(product.stock);
            return (
              <div key={id} className="bg-slate-50/50 rounded-[2rem] p-5 border border-slate-100 relative group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {imgSrc
                      ? <img src={imgSrc} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                      : <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center"><Package size={24} className="text-slate-300" /></div>
                    }
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
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${badge.cls} px-2.5 py-1.5 rounded-lg`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-3 bg-white text-slate-500 rounded-xl shadow-sm"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(id, product.name)} className="p-3 bg-white text-red-500 rounded-xl shadow-sm"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
          <div className="py-24 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 font-bold text-sm max-w-xs mx-auto">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setQuery(''); setStatusFilter('All'); setCategoryFilter('All'); }}
              className="mt-8 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm sm:p-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {editingId ? `ID: ${editingId}` : 'Fill in all required fields'}
                  </p>
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
                  { id: 'Media', icon: Upload },
                ].map((tab) => (
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

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">

                {/* Tab: General */}
                {activeTab === 'General' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all placeholder:text-slate-300"
                          placeholder="e.g. Organic Turmeric Powder"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category *</label>
                        <select
                          value={showNewCategory ? '__new__' : (form.category || '')}
                          onChange={(e) => {
                            if (e.target.value === '__new__') {
                              setShowNewCategory(true);
                              setForm({ ...form, category: '' });
                            } else {
                              setShowNewCategory(false);
                              setForm({ ...form, category: e.target.value });
                            }
                          }}
                          className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                          <option value="__new__">+ Add New Category</option>
                        </select>
                        {showNewCategory && (
                          <div className="relative mt-3">
                            <input
                              type="text"
                              value={form.category}
                              className="w-full text-sm font-bold p-4 pr-10 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all border-primary"
                              placeholder="Enter new category name"
                              onChange={(e) => setForm({ ...form, category: e.target.value })}
                              autoFocus
                            />
                            <button 
                              onClick={() => { setShowNewCategory(false); setForm({ ...form, category: '' }) }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Smart Tags</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 min-h-[56px] flex flex-wrap gap-2 items-center focus-within:bg-white transition-all">
                          {form.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-black">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                            </span>
                          ))}
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                if (tagInput) { addTag(tagInput); setTagInput(''); }
                              }
                            }}
                            className="flex-1 min-w-[120px] bg-transparent text-sm font-bold outline-none px-2 py-1 placeholder:text-slate-300"
                            placeholder={form.tags.length === 0 ? "Type and press Enter..." : ""}
                          />
                        </div>
                        {tagInput && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {SUGGESTED_TAGS.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !form.tags.includes(t)).map(t => (
                              <button key={t} onClick={() => { addTag(t); setTagInput(''); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                                + {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                      <textarea
                        rows="4"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full text-sm font-bold p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all placeholder:text-slate-300"
                        placeholder="Describe the origin, benefits, and usage..."
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="w-5 h-5 accent-primary rounded"
                      />
                      <label htmlFor="featured-check" className="text-sm font-black text-slate-700 cursor-pointer">
                        ⭐ Mark as Featured Product (shown on homepage)
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Inventory */}
                {activeTab === 'Inventory' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Selling Price (₹) *</label>
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full pl-10 pr-4 py-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">MRP / Original Price</label>
                        <input
                          type="number"
                          min="0"
                          value={form.originalPrice}
                          onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                          className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Stock Units *</label>
                        <input
                          type="number"
                          min="0"
                          value={form.stock}
                          onChange={(e) => setForm({ ...form, stock: e.target.value })}
                          className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Unit / Packaging</label>
                        <select
                          value={form.unit}
                          onChange={(e) => setForm({ ...form, unit: e.target.value })}
                          className="w-full p-4 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white transition-all"
                        >
                          <option value="">Select Unit</option>
                          {PREDEFINED_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Media — Drag & Drop Upload */}
                {activeTab === 'Media' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          Product Images
                        </label>
                        <span className="text-[10px] text-slate-300 font-bold">
                          {form.images.length}/{MAX_FILES} uploaded · First image = main
                        </span>
                      </div>
                      <ImageDropZone
                        uploadedImages={form.images}
                        onImagesChange={(imgs) => setForm({ ...form, images: imgs })}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-10 py-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex gap-2">
                  {activeTab === 'Inventory' && (
                    <button onClick={() => setActiveTab('General')} className="px-6 py-3 font-black text-[10px] uppercase text-slate-400 hover:text-slate-900 tracking-widest">
                      ← Back
                    </button>
                  )}
                  {activeTab === 'Media' && (
                    <button onClick={() => setActiveTab('Inventory')} className="px-6 py-3 font-black text-[10px] uppercase text-slate-400 hover:text-slate-900 tracking-widest">
                      ← Back
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                  >
                    Discard
                  </button>
                  {activeTab !== 'Media' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'General' ? 'Inventory' : 'Media')}
                      className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-white bg-slate-800 rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-10 py-4 font-black text-[10px] uppercase tracking-widest text-white bg-primary rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
                    >
                      {saving && <Loader2 size={14} className="animate-spin" />}
                      {editingId ? 'Update Product' : 'Create Product'}
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
