// import React, { useContext, useState } from 'react';
// import { LocationContext } from '../context/LocationContext';
// import { AuthContext } from '../context/AuthContext';

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3;
//   const toRad = deg => (deg * Math.PI) / 180;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// const CheckInButton = () => {
//   const { position, address, checkInTarget } = useContext(LocationContext);
//   const { user, updateCheckIn, removeCheckIn, checkIns } = useContext(AuthContext);

//   const [message, setMessage] = useState('');

//   const encodedEmail = user?.email?.replace(/\./g, '_');
//   const isCheckedIn = !!checkIns[encodedEmail];

//   const handleCheckIn = () => {
//     if (!position || !checkInTarget) {
//       setMessage("📍 Location not ready.");
//       return;
//     }

//     if (!address || address === 'Unknown Address' || address.startsWith("❌")) {
//       setMessage("📍 Please click 'Get Address' first.");
//       return;
//     }

//     const distance = calculateDistance(
//       position[0], position[1],
//       checkInTarget.lat, checkInTarget.lng
//     );

//     if (distance <= checkInTarget.radius) {
//       updateCheckIn(encodedEmail, {
//         lat: position[0],
//         lng: position[1],
//         address: address.trim(),
//         time: new Date().toLocaleTimeString(),
//         date: new Date().toISOString().split("T")[0],
//         radius: checkInTarget.radius
//       });

//       setMessage(`✅ Check-In Successful! Distance: ${Math.round(distance)}m`);
//     } else {
//       setMessage(`❌ Too far to check-in. Distance: ${Math.round(distance)}m`);
//     }
//   };

//   const handleCheckOut = () => {
//     removeCheckIn(encodedEmail);
//     setMessage("🚪 Checked out successfully.");
//   };

//   return (
//     <div style={{ marginTop: '1rem', textAlign: 'center' }}>
//       {!isCheckedIn ? (
//         <button
//           onClick={handleCheckIn}
//           style={{
//             padding: '10px 20px',
//             fontSize: '16px',
//             backgroundColor: '#4CAF50',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer'
//           }}
//         >
//           📍 Check In
//         </button>
//       ) : (
//         <button
//           onClick={handleCheckOut}
//           style={{
//             padding: '10px 20px',
//             fontSize: '16px',
//             backgroundColor: '#f44336',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer'
//           }}
//         >
//           🔓 Check Out
//         </button>
//       )}
//       {message && (
//         <p style={{ marginTop: '10px' }}>{message}</p>
//       )}
//     </div>
//   );
// };

// export default CheckInButton;


import React, { useContext, useState } from 'react';
import { LocationContext } from '../context/LocationContext';
import { AuthContext } from '../context/AuthContext';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const CheckInButton = () => {
  const { position, address, checkInTarget } = useContext(LocationContext);
  const { user, updateCheckIn, removeCheckIn, checkIns } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const encodedEmail = user?.email?.replace(/\./g, '_');
  const checkInData = checkIns[encodedEmail];
  const isCheckedIn = checkInData?.status === "checkedIn";

  const handleCheckIn = () => {
    if (!position || !checkInTarget) {
      setMessage("📍 Location not ready.");
      return;
    }

    if (!address || address === 'Unknown Address' || address.startsWith("❌")) {
      setMessage("📍 Please click 'Get Address' first.");
      return;
    }

    const distance = calculateDistance(
      position[0], position[1],
      checkInTarget.lat, checkInTarget.lng
    );

    if (distance <= checkInTarget.radius) {
      updateCheckIn(encodedEmail, {
        lat: position[0],
        lng: position[1],
        address: address.trim(),
        time: new Date().toLocaleTimeString(),
        date: new Date().toISOString().split("T")[0],
        radius: checkInTarget.radius,
      });

      setMessage(`✅ Check-In Successful! Distance: ${Math.round(distance)}m`);
    } else {
      setMessage(`❌ Too far to check-in. Distance: ${Math.round(distance)}m`);
    }
  };

  const handleCheckOut = () => {
    removeCheckIn(encodedEmail);
    setMessage("🚪 Checked out successfully.");
  };

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      {!isCheckedIn ? (
        <button
          onClick={handleCheckIn}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📍 Check In
        </button>
      ) : (
        <button
          onClick={handleCheckOut}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔓 Check Out
        </button>
      )}
      {message && (
        <p style={{ marginTop: '10px' }}>{message}</p>
      )}
    </div>
  );
};

export default CheckInButton;
