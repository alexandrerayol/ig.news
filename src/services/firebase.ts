import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ignews-7534f.firebaseapp.com",
  projectId: "ignews-7534f",
  storageBucket: "ignews-7534f.appspot.com",
  messagingSenderId: "696775128914",
  appId: "1:696775128914:web:4b4195d7bec98a0c9d2c8b",
  measurementId: "G-1Z5XCDY1CF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);