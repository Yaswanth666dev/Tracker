import React, { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [position, setPosition] = useState(null); // User's live position
  const [address, setAddress] = useState(""); // Reverse geocoded address
  const [path, setPath] = useState([]); // Path to show movement

  const [checkInTarget] = useState({
     lat: 17.4356847,
  lng: 78.4576043,
  radius: 100,
  
  });

  return (
    <LocationContext.Provider
      value={{
        position,
        setPosition,
        address,
        setAddress,
        path,
        setPath,
        checkInTarget,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
