// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLTdUVBLgQlGbxhpX5Oyp26QUoY7esJNA",
  authDomain: "arbana-01.firebaseapp.com",
  projectId: "arbana-01",
  storageBucket: "arbana-01.appspot.com",
  messagingSenderId: "215263387365",
  appId: "1:215263387365:web:3f28f3394b9d20d6ed7e0c",
  measurementId: "G-7FBEJSFRJP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth   = getAuth(app);
const analytics = getAnalytics(app);