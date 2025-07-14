// import React, { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const CheckoutButton = () => {
//   const { user, removeCheckIn } = useContext(AuthContext);

//   const handleCheckout = () => {
//     if (user?.id) {
//       removeCheckIn(user.id);
//       alert('✅ You have successfully checked out!');
//     }
//   };

//   return (
//     <div style={{ marginTop: '1rem' }}>
//       <button onClick={handleCheckout} style={{ backgroundColor: '#ff4d4f', color: 'white', padding: '10px' }}>
//         🔓 Check Out
//       </button>
//     </div>
//   );
// };

// export default CheckoutButton;


import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';

const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const time = now.toLocaleTimeString();        // HH:MM:SS
  return `${date} ${time}`;
};

const encodeEmail = (email) => email.replace(/\./g, '_');

const CheckoutButton = () => {
  const { user, removeCheckIn } = useContext(AuthContext);

  const handleCheckout = () => {
    if (user?.id && user?.email) {
      const encodedId = encodeEmail(user.email);
      const checkoutRef = ref(db, `checkOuts/${encodedId}`);
      const checkoutTime = getCurrentDateTime();

      // Save to Firebase
      set(checkoutRef, { time: checkoutTime });

      // Remove local check-in
      removeCheckIn(user.id);

      alert(`✅ Checked out at ${checkoutTime}`);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={handleCheckout}
        style={{
          backgroundColor: '#ff4d4f',
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        🔓 Check Out
      </button>
    </div>
  );
};

export default CheckoutButton;
