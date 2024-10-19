import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA2ujqbvfFLA0Gy88reFq0mZL_6EcKd-t0",
    authDomain: "filter-4fb70.firebaseapp.com",
    projectId: "filter-4fb70",
    storageBucket: "filter-4fb70.appspot.com",
    messagingSenderId: "746487711981",
    appId: "1:746487711981:web:2171a6015357950cc664e4",
    measurementId: "G-KQJ0D4RDVF"
  };
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);