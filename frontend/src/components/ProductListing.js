// ProductListing.js
import React from 'react';

const ProductListing = ({ products }) => {
    // Ensure products is always an array
    const productList = Array.isArray(products) ? products : [];

    return (
        <div>
            <h2>Product Listing</h2>
            {productList.length > 0 ? (
                <ul>
                    {productList.map(product => (
                        <li key={product.id}>
                            <h3>{product.name}</h3>
                            <p>Price: ${product.price}</p>
                            <p>Eco Score: {product.eco_score || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products available.</p>
            )}
        </div>
    );
};

export default ProductListing;
