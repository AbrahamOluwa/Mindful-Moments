// // AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       setUser(user);
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, [auth]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebaseConfig'; // Import your Firestore instance

const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(db, 'users', authUser.uid); // Reference to user document
          const userDocSnapshot = await getDoc(userDocRef); // Get the document

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data(); // Get user data from Firestore
            setUser({
              uid: authUser.uid,
              email: authUser.email,
              ...userData, // Add custom user data (including username) to the user object
            });
          } else {
            // User document doesn't exist. Handle accordingly (e.g., redirect to profile creation)
            console.warn("User document not found for UID:", authUser.uid);
            setUser(authUser); // or setUser(null) if you want to force re-login
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null); // Or handle the error as needed
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);