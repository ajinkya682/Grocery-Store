// src/api/mockService.js
import { products, featuredProducts } from '../data/products';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockService = {
  // Products
  async getProducts() {
    await delay(300);
    return products;
  },

  async getFeaturedProducts() {
    await delay(200);
    return featuredProducts;
  },

  async getProductById(id) {
    await delay(200);
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  async searchProducts(query) {
    await delay(400); // Simulate network latency
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  },

  // Orders
  async getOrders() {
    await delay(500);
    return [
      { id: 'ORD-001', customer: 'Ajinkya S.', total: 1250, status: 'Delivered', date: '2023-11-01T10:00:00Z' },
      { id: 'ORD-002', customer: 'Rahul D.', total: 840, status: 'Processing', date: 'new Date().toISOString()' },
      { id: 'ORD-003', customer: 'Sneha P.', total: 320, status: 'Shipped', date: '2023-11-05T14:30:00Z' },
      { id: 'ORD-004', customer: 'Amit K.', total: 2100, status: 'Pending', date: 'new Date().toISOString()' },
    ];
  },

  // Dashboard Stats
  async getDashboardStats() {
    await delay(400);
    return {
      totalSales: 4520,
      totalOrders: 142,
      activeUsers: 89,
      revenueThisMonth: '₹1,24,500'
    };
  }
};
