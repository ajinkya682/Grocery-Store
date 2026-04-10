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

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageSettings from './pages/admin/ManageSettings';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <Router>
      <StoreProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
            {/* Public Store Context */}
            <Route path="/*" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/our-masalas" element={<OurMasalas />} />
              </Routes>
            </div>
            <Footer />
          </div>
        } />
        
        {/* Admin Panel Context (No Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<ProtectedRoute />}>
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
