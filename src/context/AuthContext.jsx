// import { createContext, useState, useEffect } from "react";
// import { db } from "../firebase";
// import { ref, set, onValue, remove } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";

// export const AuthContext = createContext();

// const encodeEmail = (email) => email.replace(/\./g, "_");

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [checkIns, setCheckIns] = useState({});

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         const email = firebaseUser.email.toLowerCase(); // ✅ normalize case
//         setUser({
//           id: email,
//           email,
//           role: email === "admin@gmail.com" ? "admin" : "user", // ✅ case-insensitive match
//         });
//       } else {
//         setUser(null);
//       }
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const checkInsRef = ref(db, "checkins/");
//     onValue(checkInsRef, (snapshot) => {
//       setCheckIns(snapshot.val() || {});
//     });
//   }, []);

//   const updateCheckIn = (id, data) => {
//     const encodedId = encodeEmail(id);
//     set(ref(db, `checkins/${encodedId}`), data);
//   };

//   const removeCheckIn = (id) => {
//     const encodedId = encodeEmail(id);
//     remove(ref(db, `checkins/${encodedId}`));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         checkIns,
//         updateCheckIn,
//         removeCheckIn,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };



import { createContext, useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, set, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

const encodeEmail = (email) => email.replace(/\./g, "_");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState({});

  // 🔐 Track current user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email.toLowerCase();
        setUser({
          id: email,
          email,
          role: email === "admin@gmail.com" ? "admin" : "user",
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  // 🔄 Realtime listener
  useEffect(() => {
    const checkInsRef = ref(db, "checkins/");
    onValue(checkInsRef, (snapshot) => {
      setCheckIns(snapshot.val() || {});
    });
  }, []);

  // ✅ Check-In
  const updateCheckIn = (id, data) => {
    const encodedId = encodeEmail(id);
    set(ref(db, `checkins/${encodedId}`), {
      ...data,
      status: "checkedIn",
    });
  };

  // ✅ Check-Out
  const removeCheckIn = (id) => {
    const encodedId = encodeEmail(id);
    const now = new Date();
    const checkoutTime = now.toLocaleTimeString();
    const checkoutDate = now.toISOString().split("T")[0];

    update(ref(db, `checkins/${encodedId}`), {
      status: "checkedOut",
      checkoutTime,
      checkoutDate,
    });
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
