import React, { useEffect, useState } from 'react';

const RecycleApprovals = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [error, setError] = useState('');

  // Fetch pending recycle items
  const fetchPendingItems = async () => {
    try {
      const token = localStorage.getItem('token'); // Get admin token
      const response = await fetch('http://127.0.0.1:5000/api/admin/recycle_items', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending items');
      }
      
      const data = await response.json();
      setPendingItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  // Handle approve or reject actions
  const handleAction = async (itemId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/admin/recycle_item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update item status');
      }

      // Refresh the pending items list after approval/rejection
      fetchPendingItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Recycle Item Approvals</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Pending Recycle Items</h3>
      {pendingItems.length === 0 ? (
        <p>No pending items.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Material</th>
              <th>Condition</th>
              <th>Description</th>
              <th>Date Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map(item => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.material}</td>
                <td>{item.condition}</td>
                <td>{item.description}</td>
                <td>{new Date(item.date_submitted).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleAction(item.id, 'Approved')}>Approve</button>
                  <button onClick={() => handleAction(item.id, 'Rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecycleApprovals;
