


// import React, { useContext, useEffect, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// import { AuthContext } from '../context/AuthContext';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Circle,
// } from 'react-leaflet';

// import { db } from '../firebase';
// import { ref, onValue } from 'firebase/database';

// const decodeEmail = (encoded) => encoded.replace(/_/g, '.');

// // 🟦 Default User Location Icon
// const locationIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -30],
// });

// // 🏢 Office Location Data
// const officeLocation = {
//    lat: 17.4318288,
//   lng:  78.4638163,
//   radius: 100,
// };

// const AdminPage = () => {
//   const { checkIns } = useContext(AuthContext);
//   const users = Object.entries(checkIns || {});
//   const [paths, setPaths] = useState({});

//   useEffect(() => {
//     const pathsRef = ref(db, 'paths');
//     const unsubscribe = onValue(pathsRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       setPaths(data);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Admin: All User Check-Ins</h2>

//       {users.length === 0 ? (
//         <p>No check-ins yet.</p>
//       ) : (
//         <>
//           <MapContainer
//             center={[officeLocation.lat, officeLocation.lng]}
//             zoom={16}
//             style={{ height: '400px', width: '100%', marginBottom: '20px' }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {/* 🏢 Office Marker & Circle */}
//             <Marker position={[officeLocation.lat, officeLocation.lng]}>
//               <Popup>
//                 <strong>🏢 Office Location</strong><br />
//                 Lat: {officeLocation.lat}<br />
//                 Lng: {officeLocation.lng}
//               </Popup>
//             </Marker>
//             <Circle
//               center={[officeLocation.lat, officeLocation.lng]}
//               radius={officeLocation.radius}
//               pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.2 }}
//             />

//             {/* 📍 User Check-ins */}
//             {users.map(([encodedId, info], index) => {
//               const path = paths[encodedId] || [];
//               const email = decodeEmail(encodedId);
//               const offset = 0.0001 * index;
//               const position = [info.lat + offset, info.lng + offset];

//               return (
//                 <React.Fragment key={encodedId}>
//                   <Marker position={position} icon={locationIcon}>
//                     <Popup>
//                       <strong>{email}</strong><br />
//                       📍 {info.address || 'No address'}<br />
//                       ⏰ {info.time || 'N/A'}
//                     </Popup>
//                   </Marker>

//                   {path.length > 1 && (
//                     <Polyline positions={path} color="blue" />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </MapContainer>

//           {/* 👥 User Info Table */}
//           <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
//             <thead>
//               <tr>
//                 <th>Email</th>
//                 <th>Address</th>
//                 <th>CheckIn-Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(([encodedId, info]) => (
//                 <tr key={encodedId}>
//                   <td>{decodeEmail(encodedId)}</td>
//                   <td>{info.address || 'N/A'}</td>
//                   <td>{typeof info.time === 'object' ? info.time?.time || 'N/A' : info.time || 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminPage;


import React, { useContext, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../context/AuthContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const decodeEmail = (encoded) => encoded.replace(/_/g, ".");

const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const officeLocation = {
  lat: 17.4318288,
  lng: 78.4638163,
  radius: 100,
};

const AdminPage = () => {
  const { checkIns } = useContext(AuthContext);
  const users = Object.entries(checkIns || {});
  const [paths, setPaths] = useState({});

  useEffect(() => {
    const pathsRef = ref(db, "paths");
    const unsubscribe = onValue(pathsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPaths(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin: All User Check-Ins</h2>

      {users.length === 0 ? (
        <p>No check-ins yet.</p>
      ) : (
        <>
          <MapContainer
            center={[officeLocation.lat, officeLocation.lng]}
            zoom={16}
            style={{ height: "400px", width: "100%", marginBottom: "20px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Office marker and radius */}
            <Marker position={[officeLocation.lat, officeLocation.lng]}>
              <Popup>
                <strong>🏢 Office Location</strong>
                <br />
                Lat: {officeLocation.lat}
                <br />
                Lng: {officeLocation.lng}
              </Popup>
            </Marker>
            <Circle
              center={[officeLocation.lat, officeLocation.lng]}
              radius={officeLocation.radius}
              pathOptions={{ color: "red", fillColor: "#f03", fillOpacity: 0.2 }}
            />

            {/* User markers */}
            {users.map(([encodedId, info], index) => {
              const path = paths[encodedId] || [];
              const email = decodeEmail(encodedId);
              const offset = 0.0001 * index;
              const position = [info.lat + offset, info.lng + offset];

              return (
                <React.Fragment key={encodedId}>
                  <Marker position={position} icon={locationIcon}>
                    <Popup>
                      <strong>{email}</strong>
                      <br />
                      📍 {info.address || "No address"}
                      <br />
                      ⏰ Check-In: {info.time || "N/A"}
                      <br />
                      ⏹️ Check-Out: {info.checkoutTime?.time || "—"}
                      <br />
                      📅 Date: {info.date || info.checkoutTime?.date || "N/A"}
                    </Popup>
                  </Marker>

                  {path.length > 1 && <Polyline positions={path} color="blue" />}
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* Table */}
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", textAlign: "left" }}
          >
            <thead>
              <tr>
                <th>Email</th>
                <th>Address</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(([encodedId, info]) => (
                <tr key={encodedId}>
                  <td>{decodeEmail(encodedId)}</td>
                  <td>{info.address || "N/A"}</td>
                  <td>{info.time || "N/A"}</td>
                  <td>{info.checkoutTime?.time || "—"}</td>
                  <td>{info.date || info.checkoutTime?.date || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminPage;
