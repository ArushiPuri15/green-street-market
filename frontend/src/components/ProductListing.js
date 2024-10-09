import React from 'react';

function ProductListing({ products, addToCart }) {
    return (
        <div>
            <h2>Product Listing</h2>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Eco Score: {product.ecoScore}</p>
                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductListing;
