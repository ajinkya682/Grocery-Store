import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import ProductDetails from './pages/ProductDetails';
import OurMasalas from './pages/OurMasalas';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Orders from './pages/Orders';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageSettings from './pages/admin/ManageSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Router>
      <StoreProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
                {/* Public Store Context wrapped in Adaptive Layout */}
                <Route path="/*" element={
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/our-masalas" element={<OurMasalas />} />
                      <Route path="/userlogin" element={<UserLogin />} />
                      <Route path="/orders" element={<Orders />} />
                    </Routes>
                  </AppLayout>
                } />
        
        {/* Admin Portal */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        
        <Route path="/admin" element={<ProtectedRoute type="admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Route>
      </Routes>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </StoreProvider>
    </Router>
  );
}

export default App;
