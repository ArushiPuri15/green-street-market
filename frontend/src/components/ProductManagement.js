import React, { useEffect, useState } from 'react';
import './ProductManagement.css';

const ProductManagement = ({ setProducts }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [ecoScore, setEcoScore] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [certifications, setCertifications] = useState('');
  const [manufacturingLocation, setManufacturingLocation] = useState('');
  const [durability, setDurability] = useState('');
  const [endOfLife, setEndOfLife] = useState('');
  const [products, setLocalProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch('http://127.0.0.1:5000/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setLocalProducts(data); 
        setProducts(data); 
      } else {
        setLocalProducts([]); 
        setProducts([]); 
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLocalProducts([]); 
      setProducts([]); 
    }
  };

  const addProduct = async () => {
    const token = localStorage.getItem('token');
    const newProduct = {
      name: productName, price, description, material,
      certifications, manufacturingLocation, durability, endOfLife
    };

    try {
      const ecoScoreResponse = await fetch('http://127.0.0.1:5000/api/calculate-eco-score', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct) 
      });

      const ecoScoreData = await ecoScoreResponse.json();
      newProduct.eco_score = ecoScoreData.eco_score; 

      const response = await fetch('http://127.0.0.1:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const editProduct = (product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setMaterial(product.material);
    setCertifications(product.certifications);
    setManufacturingLocation(product.manufacturingLocation);
    setDurability(product.durability);
    setEndOfLife(product.endOfLife);
  };

  const updateProduct = async () => {
    const token = localStorage.getItem('token');
    const updatedProduct = {
      name: productName,
      price,
      description,
      material,
      certifications,
      manufacturingLocation,
      durability,
      endOfLife
    };

    try {
      const ecoScoreResponse = await fetch('http://127.0.0.1:5000/api/calculate-eco-score', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });

      const ecoScoreData = await ecoScoreResponse.json();
      updatedProduct.eco_score = ecoScoreData.eco_score;

      const response = await fetch(`http://127.0.0.1:5000/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
        setEditingProductId(null);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setProductName('');
    setPrice('');
    setEcoScore('');
    setDescription('');
    setMaterial('');
    setCertifications('');
    setManufacturingLocation('');
    setDurability('');
    setEndOfLife('');
    setEditingProductId(null);
  };

  return (
    <div className="product-management">
      <h2>Manage Your Products</h2>
      <form onSubmit={(e) => { e.preventDefault(); editingProductId ? updateProduct() : addProduct(); }}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Certifications"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Manufacturing Location"
          value={manufacturingLocation}
          onChange={(e) => setManufacturingLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Durability"
          value={durability}
          onChange={(e) => setDurability(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="End-of-Life Disposal"
          value={endOfLife}
          onChange={(e) => setEndOfLife(e.target.value)}
          required
        />
        <button type="submit">
          {editingProductId ? 'Update Product' : 'Add Product'}
        </button>
        {editingProductId && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h3>Your Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Eco Score</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.eco_score}</td>
                <td>{product.description}</td>
                <td>
                  <button onClick={() => editProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
