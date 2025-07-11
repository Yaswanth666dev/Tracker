import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [path, setPath] = useState([]);
  const [checkInTarget, setCheckInTarget] = useState(null);

  return (
    <LocationContext.Provider value={{
      position, setPosition,
      address, setAddress,
      path, setPath,
      checkInTarget, setCheckInTarget,
    }}>
      {children}
    </LocationContext.Provider>
  );
};
