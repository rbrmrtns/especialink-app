// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI6TeAO-qmT6liRm4XJBF6VgdEp2hkh0M",
  authDomain: "especialink-front.firebaseapp.com",
  projectId: "especialink-front",
  storageBucket: "especialink-front.firebasestorage.app",
  messagingSenderId: "24794485176",
  appId: "1:24794485176:web:2db126643f869a54777f4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  console.log('Fallback to getAuth():', e.message);
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };