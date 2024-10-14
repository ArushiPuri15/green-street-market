import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Custom CSS for HomePage
import fashion from '../images/fashion.jpg';
import homeLiving from '../images/home-living.jpg';
import zeroWaste from '../images/zero-waste.jpg';
import food from '../images/food.jpg';
import product1 from '../images/product1.jpg';
import product2 from '../images/product2.jpg';

function HomePage() {
    const [products, setProducts] = useState([]); // Initialize as an array

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/products');
                const data = await response.json();
                console.log('Fetched products:', data);
                if (Array.isArray(data)) {
                    setProducts(data); // Ensure it's an array
                } else {
                    setProducts([]); // Fallback if not an array
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]); // Set empty array on error
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

            {/* Featured Categories Section */}
            <section className="featured-categories">
                <h2>Shop By Category</h2>
                <div className="categories">
                    <div className="category-card">
                        <Link to="/categories/home-living">
                            <img src={homeLiving} alt="Home & Living" />
                            <h3>Eco-Friendly Home & Living</h3>
                        </Link>
                    </div>
                    <div className="category-card">
                        <Link to="/categories/fashion">
                            <img src={fashion} alt="Fashion" />
                            <h3>Sustainable Fashion</h3>
                        </Link>
                    </div>
                    <div className="category-card">
                        <Link to="/categories/zero-waste">
                            <img src={zeroWaste} alt="Zero Waste" />
                            <h3>Zero-Waste Products</h3>
                        </Link>
                    </div>
                    <div className="category-card">
                        <Link to="/categories/food">
                            <img src={food} alt="Food" />
                            <h3>Organic & Sustainable Food</h3>
                        </Link>
                    </div>
                </div>
                <button className="show-more-btn">Show More Categories</button>
            </section>

            <hr className="section-divider" />

            {/* Eco Score Section */}
            <section className="eco-score">
                <h2>What’s Your Eco Score?</h2>
                <p>Check your eco score and make environmentally responsible purchases.</p>
                <Link to="/eco-score" className="btn">Check Your Eco Score</Link>
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
