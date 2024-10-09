import React from 'react';
import { Link } from 'react-router-dom';

function CartPage({ cartItems }) {
    console.log("Cart Items in CartPage:", cartItems); // Log cart items here

    return (
        <div>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id}>
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/checkout">
                <button>Proceed to Checkout</button>
            </Link>
        </div>
    );
}

export default CartPage;
