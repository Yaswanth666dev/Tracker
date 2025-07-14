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
// } from 'react-leaflet';

// import { db } from '../firebase';
// import { ref, onValue } from 'firebase/database';

// const decodeEmail = (encoded) => encoded.replace(/_/g, '.');

// // 🔵 Default Location Icon
// const locationIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -30],
// });

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
//             center={[users[0][1].lat, users[0][1].lng]}
//             zoom={16}
//             style={{ height: '400px', width: '100%', marginBottom: '20px' }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//          {users.map(([encodedId, info], index) => {
//   const path = paths[encodedId] || [];
//   const email = decodeEmail(encodedId);

//   // 🔄 Offset latitude & longitude slightly to prevent marker overlap
//   const offset = 0.0001 * index;
//   const position = [info.lat + offset, info.lng + offset];

//   return (
//     <React.Fragment key={encodedId}>
//       <Marker position={position} icon={locationIcon}>
//         <Popup>
//           <strong>{email}</strong><br />
//           📍 {info.address || 'No address'}<br />
//           ⏰ {info.time || 'N/A'}
//         </Popup>
//       </Marker>

//       {/* 📈 User Path */}
//       {path.length > 1 && (
//         <Polyline positions={path} color="blue" />
//       )}
//     </React.Fragment>
//   );
// })}

//           </MapContainer>

//           {/* 📝 User Details Table */}
//           <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
//             <thead>
//               <tr>
//                 <th>Email</th>
//                 <th>Address</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(([encodedId, info]) => (
//                 <tr key={encodedId}>
//                   <td>{decodeEmail(encodedId)}</td>
//                   <td>{info.address || 'N/A'}</td>
//                   <td>{info.time || 'N/A'}</td>
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


import React, { useContext, useEffect, useState } from 'react';
import L from 'leaflet';


import 'leaflet/dist/leaflet.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { AuthContext } from '../context/AuthContext';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle
} from 'react-leaflet';

import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const decodeEmail = (encoded) => encoded.replace(/_/g, '.');

const locationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const officeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const AdminPage = () => {
  const { checkIns } = useContext(AuthContext);
  const users = Object.entries(checkIns || {});

  const [paths, setPaths] = useState({});
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const [checkInTarget] = useState({
    lat: 17.4401,
    lng: 78.4825,
    radius: 100,
  });

  useEffect(() => {
    const pathsRef = ref(db, 'paths');
    const unsubscribe = onValue(pathsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPaths(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(([encodedId, info]) => {
    const email = decodeEmail(encodedId);
    const dateMatch = selectedDate
      ? info.date === selectedDate.toISOString().split('T')[0]
      : true;
    const emailMatch = selectedEmail ? email === selectedEmail : true;
    return emailMatch && dateMatch;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧭 Admin Dashboard - User Check-Ins</h2>

      {/* 🔍 Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
          background: '#f0f0f0',
          padding: '1rem',
          borderRadius: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <label><strong>Filter by Email:</strong> </label>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            style={{ padding: '5px' }}
          >
            <option value=''>All</option>
            {Array.from(new Set(users.map(([id]) => decodeEmail(id)))).map(
              (email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label><strong>Filter by Date:</strong> </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            placeholderText="Filter by date"
            className="admin-datepicker"
          />
        </div>
      </div>

      {/* 🌍 Map */}
      {filteredUsers.length === 0 ? (
        <p>❌ No check-ins found.</p>
      ) : (
        <>
          <MapContainer
            center={[checkInTarget.lat, checkInTarget.lng]}
            zoom={16}
            style={{ height: '400px', width: '100%', marginBottom: '20px' }}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

            {/* 📍 Office Marker and Circle */}
            <Marker position={[checkInTarget.lat, checkInTarget.lng]} icon={officeIcon}>
              <Popup>
                🏢 Office Location
              </Popup>
            </Marker>
            <Circle
              center={[checkInTarget.lat, checkInTarget.lng]}
              radius={checkInTarget.radius}
              pathOptions={{ color: 'green', fillOpacity: 0.1 }}
            />

            {/* 👤 User Markers */}
            {filteredUsers.map(([encodedId, info], index) => {
              const path = paths[encodedId] || [];
              const email = decodeEmail(encodedId);
              const offset = 0.0001 * index;
              const position = [info.lat + offset, info.lng + offset];

              return (
                <React.Fragment key={encodedId}>
                  <Marker position={position} icon={locationIcon}>
                    <Popup>
                      <strong>{email}</strong><br />
                      📍 {info.address || 'No address'}<br />
                      ⏰ Check-in: {info.time || 'N/A'}<br />
                      🚪 Check-out: {info.checkout || 'N/A'}
                    </Popup>
                  </Marker>
                  {path.length > 1 && (
                    <Polyline positions={path} color='blue' />
                  )}
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* 📝 Table */}
          <table
            border='1'
            cellPadding='10'
            style={{ width: '100%', textAlign: 'left' }}
          >
            <thead style={{ backgroundColor: '#ddd' }}>
              <tr>
                <th>Email</th>
                <th>Address</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(([encodedId, info]) => (
                <tr key={encodedId}>
                  <td>{decodeEmail(encodedId)}</td>
                  <td>{info.address || 'N/A'}</td>
                  <td>{info.time || 'N/A'}</td>
                  <td>{info.checkout || 'N/A'}</td>
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
