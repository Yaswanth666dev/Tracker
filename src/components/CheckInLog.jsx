import React, { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

const CheckInLog = () => {
  const { checkInLog } = useContext(LocationContext);

  const downloadCSV = () => {
    const header = "Time,Address,Status\n";
    const rows = checkInLog.map(log => `${log.time},"${log.address}",${log.status}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'checkin_log.csv';
    link.click();
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Check-In Log</h3>
      <button onClick={downloadCSV}>Download CSV</button>
      <ul>
        {checkInLog.map((log, index) => (
          <li key={index}>
            🕒 {log.time} | 📍 {log.address} | {log.status === "Success" ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckInLog;
