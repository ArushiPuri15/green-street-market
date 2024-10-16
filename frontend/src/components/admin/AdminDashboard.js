import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [recycleItems, setRecycleItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // Fetch recycle items for approval
  const fetchRecycleItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/recycle_items', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch recycle items');
      const data = await response.json();
      setRecycleItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch users for management
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch products for management
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRecycleItems();
    fetchUsers();
    fetchProducts();
  }, []);

  const handleApproveRecycleItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://127.0.0.1:5000/api/admin/recycle_item/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' }),
      });
      fetchRecycleItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectRecycleItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://127.0.0.1:5000/api/admin/recycle_item/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' }),
      });
      fetchRecycleItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Recycle Program Management */}
      <h3>Manage Recycle Program</h3>
      {recycleItems.length === 0 ? (
        <p>No pending recycle items.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Material</th>
              <th>Condition</th>
              <th>Date Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recycleItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.material}</td>
                <td>{item.condition}</td>
                <td>{new Date(item.date_submitted).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleApproveRecycleItem(item.id)}>Approve</button>
                  <button onClick={() => handleRejectRecycleItem(item.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* User Management */}
      <h3>Manage Users</h3>
      {users.length === 0 ? <p>No users found.</p> : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} - Role: {user.role}
              <button>Delete User</button> {/* Add functionality later */}
            </li>
          ))}
        </ul>
      )}

      {/* Product Management */}
      <h3>Manage Products</h3>
      {products.length === 0 ? <p>No products found.</p> : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - Price: ${product.price}
              <button>Approve Product</button> {/* Add functionality later */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
