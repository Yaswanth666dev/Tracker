import React, { useContext, useEffect, useState } from 'react';
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
  const {
    position,
    address,
    checkInTarget,
    setCheckInTarget,
    setAddress,
  } = useContext(LocationContext);

  const {
    user,
    updateCheckIn,
    removeCheckIn,
    checkIns
  } = useContext(AuthContext);

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (position && !checkInTarget) {
      setCheckInTarget({
        lat: position[0],
        lng: position[1],
        radius: 100,
      });
    }
  }, [position, checkInTarget, setCheckInTarget]);

  const handleCheckIn = () => {
    if (!position || !checkInTarget) {
      setMessage("📍 Location not ready.");
      return;
    }

    if (!address || address.startsWith("📡") || address.startsWith("❌")) {
      setMessage("📍 Please click 'Get Address' first.");
      return;
    }

    const distance = calculateDistance(
      position[0], position[1],
      checkInTarget.lat, checkInTarget.lng
    );

    if (distance <= checkInTarget.radius) {
      setMessage(`✅ Check-In Successful! (${Math.round(distance)}m)`);

      if (user?.id) {
        const cleanedAddress = address.replace(/^📌 (Approx\.)?Address:\s*/, '').trim();

       updateCheckIn(user.id, {
  lat: position[0],
  lng: position[1],
  address: cleanedAddress,
  time: new Date().toLocaleTimeString(),
  radius: checkInTarget.radius, // ✅ ADD THIS LINE
});
      }
    } else {
      setMessage(`❌ Too far to check-in. (${Math.round(distance)}m)`);
    }
  };

  const handleCheckOut = () => {
    if (user?.id) {
      removeCheckIn(user.id);
      setMessage("🚪 Checked out successfully.");
      setCheckInTarget(null);
      setAddress('');
    }
  };

  const isCheckedIn = !!checkIns[user?.id.replace(/\./g, '_')];

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
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default CheckInButton;
