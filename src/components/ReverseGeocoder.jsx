import React, { useState } from 'react';
import axios from 'axios';

const ReverseGeocoder = () => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAddress = () => {
    setLoading(true);
    setAddress('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation not supported.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log('📍 Location:', latitude, longitude);

        const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
        if (!apiKey) {
          setError('Missing API key. Check .env file.');
          setLoading(false);
          return;
        }

        try {
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
          const response = await axios.get(url);
          console.log('✅ OpenCage API Response:', response.data);

          const result = response.data.results[0];
          setAddress(result?.formatted || 'Address not found.');
        } catch (err) {
          console.error('❌ API Error:', err);
          setError('Failed to fetch address.');
        }

        setLoading(false);
      },
      (err) => {
        console.error('❌ Geolocation error:', err);
        setError('Location permission denied or unavailable.');
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={getAddress}>📍 Get My Address</button>
      {loading && <p>Loading address...</p>}
      {address && <p><strong>Address:</strong> {address}</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
    </div>
  );
};

export default ReverseGeocoder;
