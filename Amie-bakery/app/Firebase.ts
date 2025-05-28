// Firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
