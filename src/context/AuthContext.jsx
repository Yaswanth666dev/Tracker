import { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, set, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // ✅ make sure this is exported

export const AuthContext = createContext();

const encodeEmail = (email) => email.replace(/\./g, "_");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState({});

  // ✅ Watch for auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.email,
          email: firebaseUser.email,
          role: firebaseUser.email === "admin@gmail.com" ? "admin" : "user",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  // 🔁 Load check-ins
  useEffect(() => {
    const checkInsRef = ref(db, "checkins/");
    onValue(checkInsRef, (snapshot) => {
      setCheckIns(snapshot.val() || {});
    });
  }, []);

  const updateCheckIn = (id, data) => {
    const encodedId = encodeEmail(id);
    set(ref(db, `checkins/${encodedId}`), data);
  };

  const removeCheckIn = (id) => {
    const encodedId = encodeEmail(id);
    remove(ref(db, `checkins/${encodedId}`));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checkIns,
        updateCheckIn,
        removeCheckIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
