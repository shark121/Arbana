// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth  } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsCMkKlVQ7ScVomNMds-xPTQPlgC8aFCs",
  authDomain: "arbana-02.firebaseapp.com",
  projectId: "arbana-02",
  storageBucket: "arbana-02.appspot.com",
  messagingSenderId: "653302772238",
  appId: "1:653302772238:web:89168e94e8e78ee992c25f",
  measurementId: "G-0F3MQ7DWZV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth   = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const database = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});


// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6Lch0N4lAAAAACh4r3uJw9b8q1qvSg8y7aUeH5q8"),
//   isTokenAutoRefreshEnabled: true,
// });





// const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);