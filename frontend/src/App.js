import React, { useEffect, useState } from 'react';
import './styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductListing from './components/ProductListing';
import CartPage from './components/CartPage';
import ProfilePage from './components/ProfilePage';
import CheckoutPage from './components/CheckoutPage'; 
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';

function App() {
  const [products, setProducts] = useState([]);
  const [dynamicPrice, setDynamicPrice] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    // Retrieve cart items from local storage on initial load
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleRegister = () => setIsAuthenticated(false);

  // Fetch products and dynamic pricing
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/products');
        const data = await response.json();
        setProducts(data.products);
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
    console.log("Adding to cart:", product);
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems, product];
      console.log("Updated Cart Items:", updatedItems);
      // Save to local storage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Effect to sync local storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
        <NavBar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListing products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
        </Routes>
    </Router>
);
}

export default App;
