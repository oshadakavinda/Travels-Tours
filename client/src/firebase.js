// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "renuka-travels.firebaseapp.com",
  projectId: "renuka-travels",
  storageBucket: "renuka-travels.appspot.com",
  messagingSenderId: "739575227520",
  appId: "1:739575227520:web:b1dfd8e8e297e651677265"
};

// Initialize Firebase safely only if API key is provided
export const app = apiKey ? initializeApp(firebaseConfig) : null;