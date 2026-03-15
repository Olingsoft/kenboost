import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChdV_NM5-Dle28cHn-8eSARAr6DBg-nvU",
  authDomain: "kenboost-ae807.firebaseapp.com",
  projectId: "kenboost-ae807",
  storageBucket: "kenboost-ae807.firebasestorage.app",
  messagingSenderId: "840122294736",
  appId: "1:840122294736:web:2973bf106e4791f0d9d9d5",
  measurementId: "G-469D0LT4T4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics is only supported in browser environments
const analytics = typeof window !== "undefined" ? isSupported().then((yes) => yes ? getAnalytics(app) : null) : null;

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, googleProvider };
