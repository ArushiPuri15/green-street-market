import React from 'react';
import { Link } from 'react-router-dom';
import './SellerDashboard.css'; // Create a CSS file for styles

const SellerDashboard = () => {
    return (
        <div className="seller-dashboard">
            {/* Dashboard Header */}
            <header className="seller-dashboard-header">
                <div className="seller-logo">🌿 Green Street Market</div>
                <nav className="seller-navbar">
                    <ul>
                        <li><Link to="/dashboard" className="seller-nav-link">Dashboard</Link></li>
                        <li><Link to="/dashboard/products" className="seller-nav-link">Product Management</Link></li>
                        <li><Link to="/dashboard/eco-score" className="seller-nav-link">Eco Score</Link></li>
                        <li><Link to="/dashboard/dynamic-pricing" className="seller-nav-link">Dynamic Pricing</Link></li>
                        <li><Link to="/dashboard/inventory-management" className="seller-nav-link">Inventory Management</Link></li>
                        <li><Link to="/dashboard/orders" className="seller-nav-link">Orders</Link></li>
                        <li><Link to="/logout" className="seller-nav-link">Logout</Link></li>
                    </ul>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="seller-hero-section">
                <div className="seller-hero-content">
                    <h1>Sell On GSM</h1>
                    <p>Welcome, [Seller Name]!</p>
                </div>
            </section>

            {/* Main Dashboard Area */}
            <div className="seller-main-dashboard">
                <div className="seller-overview-container">
                    {/* Left Column */}
                    <div className="seller-left-column">
                        <div className="seller-quick-stats">
                            <div className="seller-card">
                                <h3>Total Products Listed</h3>
                                <p>150</p>
                            </div>
                            <div className="seller-card">
                                <h3>Total Sales</h3>
                                <p>500</p>
                            </div>
                            <div className="seller-card">
                                <h3>Average Eco Score</h3>
                                <p>75</p>
                            </div>
                        </div>
                        
                        <div className="seller-low-inventory-alerts">
                        <h2>Low Inventory Alerts</h2>
                            <p><strong>Product A:</strong> 5 units left - Restock Now!</p>
                            <p><strong>Product B:</strong> 3 units left - Restock Now!</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="seller-right-column">
                        <div className="seller-eco-impact">
                            <h2>Eco Impact Statistics</h2>
                            <div className="seller-eco-impact-chart">[Chart Placeholder]</div>
                            <p>Your efforts have saved X amount of CO2!</p>
                        </div>
                    </div>
                </div>

                {/* Product Management Section */}
                <section className="seller-product-management">
                    <h2>Product Management</h2>
                    <button className="seller-dashboard-btn">Add Product</button>
                    <button className="seller-dashboard-btn">Edit Product</button>
                    <button className="seller-dashboard-btn seller-btn-delete">Delete Product</button>
                </section>

                {/* Inventory Management Section */}
                <section className="seller-inventory-management">
                    <h2>Inventory Management</h2>
                    <div className="seller-inventory-table">
                        <p>Inventory Overview Table Placeholder</p>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="seller-footer">
                <p>
                    <Link to="/terms" className="seller-footer-link">Terms of Service</Link> | 
                    <Link to="/privacy" className="seller-footer-link">Privacy Policy</Link> | 
                    <Link to="/contact" className="seller-footer-link">Contact Us</Link>
                </p>
            </footer>
        </div>
    );
};

export default SellerDashboard;

