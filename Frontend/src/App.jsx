// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar   from './components/layout/Navbar';
import Footer   from './components/layout/Footer';
import Home     from './pages/Home';
import Products from './pages/Products';
import Contact  from './pages/Contact';
import Cart     from './pages/Cart';

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/"         element={<Home />}     />
              <Route path="/products" element={<Products />} />
              <Route path="/contact"  element={<Contact />}  />
              <Route path="/cart"     element={<Cart />}     />
              {/* Catch-all */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
