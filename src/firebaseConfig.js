// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCasVJllYT9d8ebIztgEYz2gvuxIoo3Lps",
  authDomain: "cache-me-outside-437317.firebaseapp.com",
  projectId: "cache-me-outside-437317",
  storageBucket: "cache-me-outside-437317.appspot.com",
  messagingSenderId: "868404322111",
  appId: "1:868404322111:web:27b2acf89bd3d46d0d7d8a",
  measurementId: "G-9GRYBG6WDD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
