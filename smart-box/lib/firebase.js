// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyBMCIVr_MDnxE_SlFrLn-80Zka37XXJqP4",
  authDomain: "smart-box-21d07.firebaseapp.com",
  projectId: "smart-box-21d07",
  storageBucket: "smart-box-21d07.firebasestorage.app",
  messagingSenderId: "628599744430",
  appId: "1:628599744430:web:e59416d8b0a96c41d84a3f",
  measurementId: "G-3KLFFZMFV2",
};
//  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
// Initialize Firebase only if it hasn't been initialized
let app;
let auth;
let googleProvider;
let db;

app = initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app)
googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
