import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PaymentGateway.css';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upi: ''
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentAmount = queryParams.get('amount');
    if (paymentAmount) {
      setAmount(paymentAmount);
    } else {
      toast.error("Invalid payment session.");
      navigate('/');
    }

    const saved = JSON.parse(localStorage.getItem('paymentDetails'));
    if (saved) setPaymentDetails(saved);
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDetails = { ...paymentDetails, [name]: value };
    setPaymentDetails(updatedDetails);
    localStorage.setItem('paymentDetails', JSON.stringify(updatedDetails));
  };

  const handlePayment = () => {
    if (!paymentDetails.name || !(paymentDetails.cardNumber || paymentDetails.upi)) {
      return toast.error("Please fill in payment details.");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Place order logic
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
        id: Date.now(),
        items: cartItems,
        amount,
        date: new Date().toLocaleString(),
        status: 'Placed'
      };
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

      // Clear cart
      localStorage.removeItem('cartItems');

      toast.success("Payment & Order Successful! Redirecting...");
      navigate('/myorders');
    }, 2000);
  };

  return (
    <div className="payment-gateway">
      <h2>PAYMENT GATEWAY</h2>
      <p><strong>Amount to Pay:</strong> {amount}</p>

      <div className="payment-form">
        <input
          type="text"
          placeholder="Name on Card"
          name="name"
          value={paymentDetails.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Card Number"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="MM/YY"
          name="expiry"
          value={paymentDetails.expiry}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="CVV"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handleInputChange}
        />
        <div style={{ margin: "1rem 0", textAlign: "center" }}>— OR —</div>
        <input
          type="text"
          placeholder="UPI ID (e.g., user@upi)"
          name="upi"
          value={paymentDetails.upi}
          onChange={handleInputChange}
        />
      </div>

      <div className="payment-actions">
        <button onClick={handlePayment} disabled={loading} className="payment-button">
          {loading ? 'Processing Payment...' : 'Complete Payment'}
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;
