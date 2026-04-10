// src/context/ProductContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Attempt local storage load first 
    const saved = localStorage.getItem('storeProductsDB');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error parsing stored products", e);
      }
    }
    // Fall back to initial seed data
    return initialProducts;
  });

  // Keep local storage in sync
  useEffect(() => {
    localStorage.setItem('storeProductsDB', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    product.id = new Date().getTime(); // simple ID generation
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) => 
      prev.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
