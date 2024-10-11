import React, { useEffect, useState } from 'react';
import './ProductManagement.css';

const ProductManagement = ({ setProducts }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [ecoScore, setEcoScore] = useState('');
  const [description, setDescription] = useState('');
  const [products, setLocalProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Track the product being edited

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const response = await fetch('http://127.0.0.1:5000/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('Fetched products:', data);
      if (Array.isArray(data)) {
        setLocalProducts(data); // Set products locally
        setProducts(data); // Also update the parent state
      } else {
        setLocalProducts([]); // Fallback in case it's not
        setProducts([]); // Set parent state to empty array
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLocalProducts([]); // Set empty array on error
      setProducts([]); // Set parent state to empty array
    }
  };

  const addProduct = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const newProduct = { name: productName, price, eco_score: ecoScore, description };
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        fetchProducts(); // Re-fetch products after adding
        // Reset form fields
        resetForm();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const editProduct = (product) => {
    setEditingProductId(product.id); // Set the current product to edit
    setProductName(product.name);
    setPrice(product.price);
    setEcoScore(product.eco_score);
    setDescription(product.description);
  };

  const updateProduct = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const updatedProduct = { id: editingProductId, name: productName, price, eco_score: ecoScore, description };

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });

      if (response.ok) {
        fetchProducts(); // Re-fetch products after updating
        resetForm(); // Reset form fields
        setEditingProductId(null); // Clear editing state
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchProducts(); // Re-fetch products after deleting
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
    setEditingProductId(null); // Clear editing state
  };

  return (
    <div className="product-management">
      <h2>Manage Your Products</h2>
      <form onSubmit={(e) => { e.preventDefault(); editingProductId ? updateProduct() : addProduct(); }}>
        <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Eco Score" value={ecoScore} onChange={(e) => setEcoScore(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">{editingProductId ? 'Update Product' : 'Add Product'}</button>
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
          {products.map((product) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
