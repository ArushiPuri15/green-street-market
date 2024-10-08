import React, { useEffect, useState } from 'react';
import './styles.css';

function App() {
    const [products, setProducts] = useState([]);
    const [dynamicPrice, setDynamicPrice] = useState(null);
    const [description, setDescription] = useState('');
    const [sustainabilityScore, setSustainabilityScore] = useState(null);
    const [action, setAction] = useState('resell'); // Default action
    const [environmentalMessage, setEnvironmentalMessage] = useState('');

    useEffect(() => {
        // Fetch products
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/products');
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        // Fetch dynamic pricing
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

    // Handle sustainability form submission
    const handleSustainabilitySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/sustainability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });
            const data = await response.json();
            setSustainabilityScore(data.score);
        } catch (error) {
            console.error("Error fetching sustainability score:", error);
        }
    };

    // Handle environmental program submission
    const handleEnvironmentalSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/environmental-program', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, description }),
            });
            const data = await response.json();
            setEnvironmentalMessage(data.message); // Show success message
        } catch (error) {
            console.error("Error submitting environmental action:", error);
        }
    };

    return (
        <div className="App">
            <h1>Welcome to Green Street Market</h1>
            <h2>Dynamic Price: ${dynamicPrice}</h2>
            
            {/* Sustainability Form */}
            <form onSubmit={handleSustainabilitySubmit}>
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter product description" 
                />
                <button type="submit">Check Sustainability</button>
            </form>
            {sustainabilityScore !== null && <h3>Sustainability Score: {sustainabilityScore}</h3>}

            {/* Environmental Program Form */}
            <form onSubmit={handleEnvironmentalSubmit}>
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="resell">Resell</option>
                    <option value="donate">Donate</option>
                    <option value="recycle">Recycle</option>
                </select>
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter product description" 
                />
                <button type="submit">Submit Action</button>
            </form>
            {environmentalMessage && <h3>{environmentalMessage}</h3>}

            {/* Products List */}
            <h3>Available Products:</h3>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>{product}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
