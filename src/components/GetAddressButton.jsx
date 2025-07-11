import React, { useState, useContext } from 'react';
import axios from 'axios';
import { LocationContext } from '../context/LocationContext';

const GetAddressButton = () => {
  const [loading, setLoading] = useState(false);
  const { setAddress, setPosition } = useContext(LocationContext);

  const handleGetAddress = () => {
    setLoading(true);
    setAddress("📡 Fetching location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        try {
          const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
          const res = await axios.get(url);
          const addr = res.data.results[0]?.formatted;
          setAddress(addr ? `📌 Address: ${addr}` : "📌 Address not found.");
        } catch (err) {
          console.error(err);
          setAddress("❌ Failed to fetch address.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn("⚠️ Geolocation error", err);
        if (err.code === 1) {
          // Permission denied
          setAddress("❌ Location permission denied.");
        } else {
          setAddress("❌ Location unavailable.");
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <button
        onClick={handleGetAddress}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#999' : '#2196f3',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Locating...' : '📍 Get Address'}
      </button>
    </div>
  );
};

export default GetAddressButton;
