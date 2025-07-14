// // ✅ MapTracker.jsx
// import React, { useEffect, useContext } from 'react';
// import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet';
// import { LocationContext } from '../context/LocationContext';
// import L from 'leaflet';
// // ✅ Firebase imports
// import { db } from '../firebase';
// import { ref, set } from 'firebase/database';
// import { AuthContext } from '../context/AuthContext';

// const targetIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535239.png', // green location icon
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -30],
// });

// const MapTracker = () => {
//   const { position, setPosition, path, setPath, checkInTarget } = useContext(LocationContext);

//   // ✅ Get user to identify path by email
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const newPos = [latitude, longitude];
//         setPosition(newPos);
//         setPath((prev) => {
//           const updatedPath = [...prev, newPos];

//           // ✅ Store in Firebase under /paths/user_email
//           const encodedEmail = user?.email?.replace(/\./g, '_');
//           if (encodedEmail) {
//             const pathRef = ref(db, `paths/${encodedEmail}`);
//             set(pathRef, updatedPath);
//           }

//           return updatedPath;
//         });
//       },
//       (err) => {
//         console.error('Geolocation error:', err);
//       },
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, [setPath, setPosition, user]);

//   return position ? (
//     <MapContainer center={position} zoom={16} style={{ height: '300px', width: '100%' }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <Marker position={position}>
//         <Popup>📍 You are here</Popup>
//       </Marker>
//       <Polyline positions={path} color="blue" />
//       {checkInTarget && (
//       <Marker position={[checkInTarget.lat, checkInTarget.lng]} icon={targetIcon}>
//   <Popup>🏁 Check-In Target</Popup>
// </Marker>
//       )}
//     </MapContainer>
//   ) : (
//     <p>📡 Locating...</p>
//   );
// };

// export default MapTracker;


import React, { useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet';
import { LocationContext } from '../context/LocationContext';
import L from 'leaflet';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';

const targetIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// ✅ Fixed Office Location
const officeLocation = {
  lat: 17.438495,
  lng: 78.448345,
  radius: 100
};

const MapTracker = () => {
  const { position, setPosition, path, setPath } = useContext(LocationContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];
        setPosition(newPos);

        setPath((prev) => {
          const updatedPath = [...prev, newPos];

          const encodedEmail = user?.email?.replace(/\./g, '_');
          if (encodedEmail) {
            const pathRef = ref(db, `paths/${encodedEmail}`);
            set(pathRef, updatedPath);
          }

          return updatedPath;
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setPath, setPosition, user]);

  return position ? (
    <MapContainer center={[officeLocation.lat, officeLocation.lng]} zoom={16} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={position}>
        <Popup>📍 You are here</Popup>
      </Marker>

      <Polyline positions={path} color="blue" />

      <Marker position={[officeLocation.lat, officeLocation.lng]} icon={targetIcon}>
        <Popup>🏢 Office Check-In Point</Popup>
      </Marker>

      <Circle
        center={[officeLocation.lat, officeLocation.lng]}
        radius={officeLocation.radius}
        pathOptions={{ color: 'green', fillOpacity: 0.2 }}
      />
    </MapContainer>
  ) : (
    <p>📡 Locating...</p>
  );
};

export default MapTracker;
