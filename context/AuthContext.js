import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null); 

  const [userProfile, setUserProfile] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUserAuth(user);

      if (!user) {
        setUserProfile(null);
        setLoading(false);
      }

    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (userAuth) {
      const userRef = doc(db, "usuarios", userAuth.uid);

      const unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Erro no listener do perfil:", error);
        setLoading(false);
      });

      return () => unsubscribeFirestore();
    }
  }, [userAuth]);

  return (
    <AuthContext.Provider value={{ userAuth, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};