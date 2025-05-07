// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALnOUjfBc4Gxbg8uzwdoOvHt48JlebPm4",
  authDomain: "cse3mad-9c443.firebaseapp.com",
  databaseURL: "https://cse3mad-9c443-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cse3mad-9c443",
  storageBucket: "cse3mad-9c443.firebasestorage.app",
  messagingSenderId: "404894922403",
  appId: "1:404894922403:web:df5bd051e10466460b7116",
  measurementId: "G-8VTNYNCQZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);