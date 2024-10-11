import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Custom CSS for HomePage

function HomePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/products'); 
                const data = await response.json();
                console.log('Fetched products:', data);
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]); // Fallback if not an array
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]); // Set to empty on error
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            {/* Header/NavBar */}
            <header className="header">
                <div className="logo">
                    <Link to="/">🌿 Green Street Market</Link>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><Link to="/" className="nav-button">Home</Link></li>
                        <li><Link to="/categories" className="nav-button">Categories</Link></li>
                        <li><Link to="/recycle-program" className="nav-button">Recycle Program</Link></li>
                        <li><Link to="/about" className="nav-button">About Us</Link></li>
                        <li><Link to="/eco-points" className="nav-button">Eco Points</Link></li>
                        <li><Link to="/cart" className="nav-button">Cart</Link></li>
                        <li><Link to="/profile" className="nav-button">Profile</Link></li>
                    </ul>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Shop Sustainably, Live Consciously</h1>
                    <p>Eco-friendly products for a greener future. Shop now and earn eco-points for every sustainable choice!</p>
                    <div className="cta-buttons">
                        <Link to="/products" className="btn btn-shop-now">Shop Now</Link>
                        <Link to="/eco-points" className="btn btn-learn-more">Learn More</Link>
                    </div>
                </div>
            </section>

            <hr className="section-divider" />

            {/* Search Bar */}
            <section className="search-bar">
                <input type="text" placeholder="Search for sustainable products..." className="search-input" />
                <button className="search-button">Search</button>
            </section>

            <hr className="section-divider" />

            {/* Featured Products Section */}
            <section className="featured-products">
                <h2>Popular Sustainable Products</h2>
                <div className="product-grid">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            <div className="product-card" key={product.id}>
                                <Link to={`/products/${product.id}`}>
                                    <img src={product.image || 'default-image-url.jpg'} alt={product.name} className="product-img" />
                                    <h3>{product.name}</h3>
                                </Link>
                                <p>${product.price}</p>
                                <p>Eco Score: {product.eco_score || 'N/A'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
                <Link to="/products" className="btn">Shop All Products</Link>
            </section>

            <hr className="section-divider" />

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                    <div className="footer-social">
                        <a href="https://facebook.com">Facebook</a>
                        <a href="https://instagram.com">Instagram</a>
                        <a href="https://twitter.com">Twitter</a>
                        <a href="https://linkedin.com">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
