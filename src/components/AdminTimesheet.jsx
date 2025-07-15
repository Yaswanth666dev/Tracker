// import React, { useEffect, useState, useContext } from 'react';
// import { db } from '../firebase';
// import { ref, onValue } from 'firebase/database';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { AuthContext } from '../context/AuthContext';

// const decodeEmail = (encoded) => encoded.replace(/_/g, '.');

// const AdminTimesheet = () => {
//   const [checkIns, setCheckIns] = useState({});
//   const [selectedEmail, setSelectedEmail] = useState('');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     const checkInRef = ref(db, 'checkins');
//     const unsub = onValue(checkInRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       setCheckIns(data);
//     });
//     return () => unsub();
//   }, []);

//   // Convert AM/PM to 24-hour format
//   const convertTo24Hour = (time) => {
//     if (!time || typeof time !== 'string') return '00:00';
//     const [t, modifier] = time.split(' ');
//     let [hours, minutes] = t.split(':').map(Number);
//     if (modifier === 'PM' && hours !== 12) hours += 12;
//     if (modifier === 'AM' && hours === 12) hours = 0;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   // Safely get time from value (string or object)
//   const getTimeString = (value) => {
//     if (!value) return 'N/A';
//     if (typeof value === 'string') return value;
//     if (typeof value === 'object' && value.time) return value.time;
//     return 'N/A';
//   };

//   const calculateTotalHours = (checkInRaw, checkOutRaw) => {
//     const checkIn = getTimeString(checkInRaw);
//     const checkOut = getTimeString(checkOutRaw);

//     if (checkIn === 'N/A' || checkOut === 'N/A') return 'N/A';

//     const inDate = new Date(`1970-01-01T${convertTo24Hour(checkIn)}`);
//     const outDate = new Date(`1970-01-01T${convertTo24Hour(checkOut)}`);
//     const diff = outDate - inDate;

//     if (isNaN(diff) || diff <= 0) return 'Invalid';

//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${minutes}m`;
//   };

//   const usersData = Object.entries(checkIns)
//     .map(([encodedEmail, data]) => ({
//       email: decodeEmail(encodedEmail),
//       ...data,
//     }))
//     .filter((entry) => {
//       const matchEmail = selectedEmail ? entry.email === selectedEmail : true;
//       const matchDate = selectedDate
//         ? entry.date === selectedDate.toISOString().split('T')[0]
//         : true;
//       return matchEmail && matchDate;
//     });

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>🧾 Admin Timesheet View</h2>
//       <p><strong>Logged in as:</strong> {user?.email}</p>

//       {/* Filters */}
//       <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
//         <div>
//           <label><strong>Filter by Email:</strong></label><br />
//           <select
//             value={selectedEmail}
//             onChange={(e) => setSelectedEmail(e.target.value)}
//             style={{ padding: '5px' }}
//           >
//             <option value="">All</option>
//             {Object.keys(checkIns).map((encodedEmail) => {
//               const email = decodeEmail(encodedEmail);
//               return (
//                 <option key={email} value={email}>{email}</option>
//               );
//             })}
//           </select>
//         </div>

//         <div>
//           <label><strong>Filter by Date:</strong></label><br />
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             dateFormat="yyyy-MM-dd"
//             maxDate={new Date()}
//             placeholderText="Choose a date"
//           />
//           {selectedDate && (
//             <button onClick={() => setSelectedDate(null)} style={{ marginLeft: '10px' }}>
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Timesheet Table */}
//       <table
//         border="1"
//         cellPadding="10"
//         style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
//       >
//         <thead style={{ background: '#eee' }}>
//           <tr>
//             <th>Email</th>
//             <th>Date</th>
//             <th>Check-In</th>
//             <th>Check-Out</th>
//             <th>Total Hours</th>
//           </tr>
//         </thead>
//         <tbody>
//           {usersData.length === 0 ? (
//             <tr>
//               <td colSpan="5">❌ No timesheet records found.</td>
//             </tr>
//           ) : (
//             usersData.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.email}</td>
//                 <td>{typeof entry.date === 'string' ? entry.date : 'N/A'}</td>
//                 <td>{getTimeString(entry.time)}</td>
//                 <td>{getTimeString(entry.checkout)}</td>
//                 <td>{calculateTotalHours(entry.time, entry.checkout)}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminTimesheet;
