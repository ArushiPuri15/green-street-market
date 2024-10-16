import React, { useState, useEffect } from 'react';

const RecycleProgram = () => {
  const [productName, setProductName] = useState('');
  const [material, setMaterial] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [submittedItems, setSubmittedItems] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle the submission of recyclable items
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token'); // Get the user's token

    try {
      const response = await fetch('http://127.0.0.1:5000/api/recycle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_name: productName,
          material: material,
          condition: condition,
          description: description,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setMessage('Recyclable item submitted successfully!');
      fetchSubmittedItems(); // Refresh the list of submitted items after submission
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to fetch the submitted recycle items
  const fetchSubmittedItems = async () => {
    const token = localStorage.getItem('token'); // Get the user's token

    try {
      const response = await fetch('http://127.0.0.1:5000/api/recycle_items', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submitted items');
      }

      const data = await response.json();
      setSubmittedItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSubmittedItems(); // Fetch submitted items on component mount
  }, []);

  return (
    <div>
      <h2>Recycle Program</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="product_name">Product Name:</label>
          <input
            type="text"
            id="product_name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="material">Material:</label>
          <input
            type="text"
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="condition">Condition:</label>
          <input
            type="text"
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Submit Recyclable Item</button>
      </form>

      <h3>Submitted Items</h3>
      {submittedItems.length === 0 ? (
        <p>No items submitted yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Material</th>
              <th>Condition</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submittedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.material}</td>
                <td>{item.condition}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td>{new Date(item.date_submitted).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecycleProgram;
