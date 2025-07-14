// import React, { createContext, useState } from 'react';

// export const LocationContext = createContext();

// export const LocationProvider = ({ children }) => {
//   const [position, setPosition] = useState(null);
//   const [address, setAddress] = useState('');
//   const [path, setPath] = useState([]);
//   const [checkInTarget, setCheckInTarget] = useState(null);

//   return (
//     <LocationContext.Provider value={{
//       position, setPosition,
//       address, setAddress,
//       path, setPath,
//       checkInTarget, setCheckInTarget,
//     }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };


import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [position, setPosition] = useState(null);     // User's live position
  const [address, setAddress] = useState('');         // Reverse geocoded address
  const [path, setPath] = useState([]);               // Path to show movement



  const [checkInTarget] = useState({
 lat: 17.4401,
  lng: 78.4825,
  radius: 100
});


  return (
    <LocationContext.Provider value={{
      position, setPosition,
      address, setAddress,
      path, setPath,
      checkInTarget
    }}>
      {children}
    </LocationContext.Provider>
  );
};

