import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  card: {
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.09)',
    padding: '40px 30px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    marginBottom: '16px',
    fontWeight: 700,
    fontSize: '2rem',
    color: '#2a5298',
    letterSpacing: '1px',
  },
  status: {
    fontSize: '1.1rem',
    marginBottom: '18px',
    minHeight: '24px',
    color: '#1e3c72',
  },
  reader: {
    width: '320px',
    margin: '0 auto',
    minHeight: '240px',
  },
};

function App() {
  const [status, setStatus] = useState('Initializing...');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startScanner();
    }, 4000); // Wait 4 seconds after load

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const startScanner = () => {
    setStatus("Starting scanner...");
    setScanning(true);

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText, decodedResult) => {
        setScanning(false);
        setStatus('Processing attendance...');
        await scanner.clear();
        markAttendance(decodedText);
      },
      (errorMessage) => {
        setStatus(`Scan Error: ${errorMessage}`);
      }
    );
  };

  const markAttendance = async (studentId) => {
    try {
      const res = await axios.post("/attendence-backend-bice.vercel.app/api/attendance/mark", { studentId });
      setStatus(res.data.message || "Attendance marked successfully! 🎉");
     
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to mark attendance. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>📷 Student Attendance Scanner</div>
        <div style={styles.status}>{status}</div>
        <div id="reader" style={styles.reader}></div>
      </div>
    </div>
  );
}

export default App;
