import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductListing from './components/ProductListing';
import CartPage from './components/CartPage';
import ProfilePage from './components/ProfilePage';
import CheckoutPage from './components/CheckoutPage'; 
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';

// New components for Seller Dashboard
import SellerDashboard from './components/SellerDashboard';
import ProductManagement from './components/ProductManagement';
import EcoScore from './components/EcoScore';
import DynamicPricing from './components/DynamicPricing';
import OrderManagement from './components/OrderManagement';
import Analytics from './components/Analytics';

function App() {
  const [products, setProducts] = useState([]); // State to hold products
  const [dynamicPrice, setDynamicPrice] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // To store whether user is 'customer' or 'seller'

  const handleLogin = (loggedInRole) => {
    setIsAuthenticated(true);
    setRole(loggedInRole); // Set the role based on login
    console.log("Logged in as:", loggedInRole); // Debugging line
  };

  const handleRegister = () => setIsAuthenticated(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null); // Reset role on logout
    localStorage.removeItem('token'); // Remove token on logout
  };

  // Fetch products and dynamic pricing
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/products');
        const data = await response.json();
        console.log('Fetched products:', data); // Debugging log
        if (Array.isArray(data)) {
          setProducts(data); // Ensure it's an array
        } else {
          setProducts([]); // Fallback in case it's not
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchDynamicPrice = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/dynamic-pricing');
        const data = await response.json();
        setDynamicPrice(data.dynamic_price);
      } catch (error) {
        console.error("Error fetching dynamic price:", error);
      }
    };

    fetchProducts();
    fetchDynamicPrice();
  }, []);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems, product];
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
        <NavBar onLogout={handleLogout} /> {/* Pass logout function to NavBar */}
        <Routes>
            <Route path="/" element={<HomePage products={products} />} />
            <Route path="/products" element={<ProductListing products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            
            {/* Conditional Seller Dashboard Routes */}
            {isAuthenticated && role === 'seller' && (
              <>
                <Route path="/dashboard" element={<SellerDashboard />} />
                <Route path="/dashboard/products" element={<ProductManagement setProducts={setProducts} />} />
                <Route path="/dashboard/eco-score" element={<EcoScore />} />
                <Route path="/dashboard/dynamic-pricing" element={<DynamicPricing />} />
                <Route path="/dashboard/orders" element={<OrderManagement />} />
                <Route path="/dashboard/analytics" element={<Analytics />} />
              </>
            )}

            {/* Conditional Customer Routes */}
            {isAuthenticated && role === 'customer' && (
              <>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} />} />
              </>
            )}
        </Routes>
    </Router>
  );
}

export default App;
