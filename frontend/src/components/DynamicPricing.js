import React, { useState } from 'react';

function DynamicPricing() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const pricingRules = {
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
    };
    console.log("Dynamic Pricing Rules:", pricingRules);

    // Send to backend (to be implemented later)
    // fetch('/api/set-pricing', { method: 'POST', body: JSON.stringify(pricingRules) })
  };

  return (
    <div className="dynamic-pricing">
      <h2>Set Dynamic Pricing</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Minimum Price:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Maximum Price:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Pricing</button>
      </form>
    </div>
  );
}

export default DynamicPricing;
