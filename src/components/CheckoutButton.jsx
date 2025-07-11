import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CheckoutButton = () => {
  const { user, removeCheckIn } = useContext(AuthContext);

  const handleCheckout = () => {
    if (user?.id) {
      removeCheckIn(user.id);
      alert('✅ You have successfully checked out!');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={handleCheckout} style={{ backgroundColor: '#ff4d4f', color: 'white', padding: '10px' }}>
        🔓 Check Out
      </button>
    </div>
  );
};

export default CheckoutButton;
