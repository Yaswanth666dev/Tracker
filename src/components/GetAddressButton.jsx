import React, { useState, useContext } from 'react';
import axios from 'axios';
import { LocationContext } from '../context/LocationContext';
import { AuthContext } from '../context/AuthContext';

const GetAddressButton = () => {
  const [loading, setLoading] = useState(false);
  const { setPosition, address, setAddress } = useContext(LocationContext);
  const { user } = useContext(AuthContext);

  const handleGetAddress = () => {
    setLoading(true);
    setAddress('Fetching location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        try {
          const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
          const res = await axios.get(url);
          const formatted = res.data.results[0]?.formatted || 'Unknown Address';
          setAddress(formatted); // ✅ only one clean address stored
        } catch (err) {
          console.error(err);
          setAddress('Failed to fetch address.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        setAddress(err.code === 1 ? 'Location permission denied.' : 'Location unavailable.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '30px',
        border: '2px solid #ccc',
        borderRadius: '16px',
        backgroundColor: '#fefefe',
        maxWidth: '700px',
        minHeight: '250px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        fontSize: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>👤 User Information</h3>
      <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>

      <button
        onClick={handleGetAddress}
        disabled={loading}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#999' : '#2196f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '⏳ Locating...' : '📍 Get Address'}
      </button>

      {/* ✅ Show address only once here */}
      {address && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor: '#f8f8f8',
            fontSize: '14px',
          }}
        >
          📌 Address: {address}
        </div>
      )}
    </div>
  );
};

export default GetAddressButton;
