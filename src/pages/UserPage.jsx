import React, { useContext } from 'react';
import MapTracker from '../components/MapTracker';
import CheckInButton from '../components/CheckInButton';
import GetAddressButton from '../components/GetAddressButton';
import { LocationContext } from '../context/LocationContext';

const UserPage = () => {
  const { address } = useContext(LocationContext);

  return (
    <div>
      <h2>User: Live Tracker</h2>
      <MapTracker />
      <GetAddressButton />
      {address && <p style={{ marginTop: '1rem' }}>📌 Address: {address}</p>}
      <CheckInButton />
    </div>
  );
};

export default UserPage;
