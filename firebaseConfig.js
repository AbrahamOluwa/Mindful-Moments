// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";


 const firebaseConfig = {
  apiKey: "AIzaSyDLyDZhVzxMahSvh0l8CEJtC7i1mL_wk6Y",
  authDomain: "mindful-moments-185ed.firebaseapp.com",
  projectId: "mindful-moments-185ed",
  storageBucket: "mindful-moments-185ed.appspot.com",
  messagingSenderId: "323618927137",
  appId: "1:323618927137:web:466311b36862fc5f9c6960",
  measurementId: "G-W70RZPFXHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
//const analytics = getAnalytics(app);

export  {app, db, auth, storage};


// let firebaseApp: FirebaseApp

// if (!getApps.length) {
//   firebaseApp = initializeApp(firebaseConfig)
// }

// const fireStore = getFirestore(firebaseApp)
// const auth = getAuth(firebaseApp)
// const storage = getStorage(firebaseApp)

// export { fireStore, auth, storage }