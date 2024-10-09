import React, { useState } from 'react';

function CheckoutPage({ cartItems }) {
    const [shippingAddress, setShippingAddress] = useState('');

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    const handleMockPayment = () => {
        console.log('Payment simulated successfully!');
        // Redirect to success page or show success message
        alert('Payment simulated successfully! Thank you for your order.');
        // You can also implement redirect logic here, if you have a success page
    };

    return (
        <div>
            <h2>Checkout</h2>
            <form>
                <div>
                    <label>
                        Shipping Address:
                        <input
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <h3>Total Amount: ₹{calculateTotal()}</h3>
                <button type="button" onClick={handleMockPayment}>
                    Simulate Payment
                </button>
            </form>
        </div>
    );
}

export default CheckoutPage;
