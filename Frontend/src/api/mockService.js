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
      { id: 'ORD-1024', customer: 'Ajinkya S.', total: 1250, status: 'Delivered', date: new Date(Date.now() - 86400000).toISOString(), items: 5 },
      { id: 'ORD-1025', customer: 'Rahul D.', total: 840, status: 'Processing', date: new Date().toISOString(), items: 3 },
      { id: 'ORD-1026', customer: 'Sneha P.', total: 320, status: 'Shipped', date: new Date(Date.now() - 172800000).toISOString(), items: 2 },
      { id: 'ORD-1027', customer: 'Amit K.', total: 2100, status: 'Pending', date: new Date().toISOString(), items: 8 },
    ];
  },

  // Dashboard Stats
  async getDashboardStats() {
    await delay(600);
    return {
      totalProducts: products.length,
      activeOrders: 142,
      totalRevenue: '₹1,24,500',
      revenueGrowth: '+12.5%',
      lowStockCount: products.filter(p => p.stock < 10).length,
      
      // Chart Data: Last 7 Days Sales
      salesTrend: [
        { day: 'Mon', sales: 4200, orders: 12 },
        { day: 'Tue', sales: 6100, orders: 18 },
        { day: 'Wed', sales: 3800, orders: 11 },
        { day: 'Thu', sales: 8200, orders: 24 },
        { day: 'Fri', sales: 7500, orders: 20 },
        { day: 'Sat', sales: 12400, orders: 35 },
        { day: 'Sun', sales: 9800, orders: 28 },
      ],
      
      // Chart Data: Revenue by Category
      categoryRevenue: [
        { name: 'Masalas', value: 45000 },
        { name: 'Grains', value: 32000 },
        { name: 'Dairy', value: 18000 },
        { name: 'Vegetables', value: 29500 },
      ],

      // Top Selling Products
      topProducts: products.slice(0, 5).map(p => ({
        ...p,
        sales: Math.floor(Math.random() * 500) + 100,
        growth: '+8%'
      }))
    };
  }
};
