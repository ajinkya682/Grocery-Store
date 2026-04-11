// src/context/ProductContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/apiService';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch all products ─────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getAll({ limit: 100, ...params });
      setProducts(data.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('ProductContext: fetchProducts error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch categories ───────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await productsAPI.getCategories();
      setCategories(Array.isArray(data.data) ? data.data : data.data.categories || []);
    } catch (err) {
      console.error('ProductContext: fetchCategories error', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ─── CRUD ────────────────────────────────────────────────────────────────────
  const addProduct = async (productData) => {
    try {
      const { data } = await productsAPI.create(productData);
      setProducts((prev) => [data.data.product, ...prev]);
      return { success: true, product: data.data.product };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create product',
      };
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const { data } = await productsAPI.update(id, updatedFields);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.data.product : p))
      );
      return { success: true, product: data.data.product };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update product',
      };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete product',
      };
    }
  };

  const searchProducts = async (query) => {
    if (!query || query.trim().length < 2) return [];
    try {
      const { data } = await productsAPI.search(query);
      return data.data.products;
    } catch {
      return [];
    }
  };

  const addCategory = async (name) => {
    try {
      const { data } = await productsAPI.createCategory({ name });
      if (data.success) {
        setCategories((prev) => [...prev, data.data].sort());
        return { success: true, name: data.data };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add category' };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        addCategory,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
