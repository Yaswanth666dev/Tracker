import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmployeeTimesheet = () => {
  const { user } = useContext(AuthContext);
  const [timesheetData, setTimesheetData] = useState([]);
  const [filteredDate, setFilteredDate] = useState(null);

  useEffect(() => {
    if (!user) return;

    const encodedEmail = user.email.replace(/\./g, '_');
    const checkInsRef = ref(db, 'checkIns');

    onValue(checkInsRef, (snapshot) => {
      const data = snapshot.val();
      const userData = [];

      for (const key in data) {
        if (key === encodedEmail) {
          const entry = data[key];
          userData.push({
            date: entry.date,
            checkIn: entry.time || 'N/A',
            checkOut: entry.checkout || 'N/A',
          });
        }
      }

      setTimesheetData(userData);
    });
  }, [user]);

  const calculateTotalHours = (checkIn, checkOut) => {
    if (checkIn === 'N/A' || checkOut === 'N/A') return 'N/A';

    const inDate = new Date(`1970-01-01T${convertTo24Hour(checkIn)}`);
    const outDate = new Date(`1970-01-01T${convertTo24Hour(checkOut)}`);
    const diffMs = outDate - inDate;

    if (isNaN(diffMs) || diffMs <= 0) return 'Invalid';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const convertTo24Hour = (time) => {
    // Converts "5:20 PM" => "17:20"
    const [t, modifier] = time.split(' ');
    let [hours, minutes] = t.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const filteredData = filteredDate
    ? timesheetData.filter(
        (entry) => entry.date === filteredDate.toISOString().split('T')[0]
      )
    : timesheetData;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧾 My Timesheet</h2>
      <p><strong>Email:</strong> {user?.email}</p>

      {/* 📅 Date Filter */}
      <div style={{ margin: '1rem 0' }}>
        <label><strong>Filter by Date:</strong> </label>
        <DatePicker
          selected={filteredDate}
          onChange={(date) => setFilteredDate(date)}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          placeholderText="Choose a date"
        />
        {filteredDate && (
          <button onClick={() => setFilteredDate(null)} style={{ marginLeft: '10px' }}>
            Clear
          </button>
        )}
      </div>

      {/* 📋 Timesheet Table */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
      >
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th>Date</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4">❌ No data available</td>
            </tr>
          ) : (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.checkIn}</td>
                <td>{entry.checkOut}</td>
                <td>{calculateTotalHours(entry.checkIn, entry.checkOut)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTimesheet;
