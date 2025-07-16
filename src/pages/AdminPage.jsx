



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
  lat: 17.4360918,
  lng: 78.4576179,
  radius: 100,
};

const AdminPage = () => {
  const { checkIns } = useContext(AuthContext);

  // ✅ Only users who checked in but not checked out
  const users = Object.entries(checkIns || {}).filter(
    ([, info]) => !info.checkoutTime
  );

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
      <h2>Admin: Users Currently Checked-In</h2>
      <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
        🟢 Total Currently In: {users.length}
      </p>

      {users.length === 0 ? (
        <p>No users currently checked in.</p>
      ) : (
        <>
          <MapContainer
            center={[officeLocation.lat, officeLocation.lng]}
            zoom={16}
            style={{ height: "400px", width: "100%", marginBottom: "20px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
                      📅 Date: {info.date || "N/A"}
                    </Popup>
                  </Marker>

                  {path.length > 1 && <Polyline positions={path} color="blue" />}
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* Table for currently checked-in users */}
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
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(([encodedId, info]) => (
                <tr key={encodedId}>
                  <td>{decodeEmail(encodedId)}</td>
                  <td>{info.address || "N/A"}</td>
                  <td>{info.time || "N/A"}</td>
                  <td>{info.date || "N/A"}</td>
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


