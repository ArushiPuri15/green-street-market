import React, { useEffect, useState } from 'react';

const EcoPoints = () => {
  const [ecoPoints, setEcoPoints] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState('');

  // Fetch eco points and vouchers
  const fetchEcoData = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token from local storage

      // Fetch eco points
      const ecoPointsResponse = await fetch('http://127.0.0.1:5000/api/eco_points', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!ecoPointsResponse.ok) {
        throw new Error('Failed to fetch eco points');
      }
      const ecoPointsData = await ecoPointsResponse.json();
      setEcoPoints(ecoPointsData.points); // Set eco points

      // Fetch vouchers
      const vouchersResponse = await fetch('http://127.0.0.1:5000/api/vouchers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!vouchersResponse.ok) {
        throw new Error('Failed to fetch vouchers');
      }

      const vouchersData = await vouchersResponse.json();
      setVouchers(vouchersData); // Set vouchers data

    } catch (error) {
      setError(error.message); // Handle any errors
    }
  };

  // Fetch eco points and vouchers when the component mounts
  useEffect(() => {
    fetchEcoData();
  }, []);

  return (
    <div>
      <h2>Eco Points and Vouchers</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Eco Points */}
      <div>
        <h3>Your Eco Points</h3>
        <p>{ecoPoints} points</p>
      </div>

      {/* Display Vouchers */}
      <div>
        <h3>Your Vouchers</h3>
        {vouchers.length === 0 ? (
          <p>No vouchers available.</p>
        ) : (
          <ul>
            {vouchers.map((voucher, index) => (
              <li key={index}>
                Code: {voucher.code}, Discount: {voucher.discount_value}%, Valid Until: {new Date(voucher.valid_until).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EcoPoints;
