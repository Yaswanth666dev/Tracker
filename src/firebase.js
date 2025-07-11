// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // 👈 Add this

const firebaseConfig = {
  apiKey: "AIzaSyAkcPTBB590J5iLpe5z90J2WRGqldXAkyY",
  authDomain: "tracker-1b2db.firebaseapp.com",
  databaseURL: "https://tracker-1b2db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tracker-1b2db",
  storageBucket: "tracker-1b2db.appspot.com",
  messagingSenderId: "972851054801",
  appId: "1:972851054801:web:3aa97e1504f558716b9df0",
  measurementId: "G-6S826LCK8E"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app); // ✅ export auth
