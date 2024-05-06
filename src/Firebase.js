import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBfJXq8Pv4KPpeyEW_fiVuHFWYdd6iaGp8",
    authDomain: "edugearswitch.firebaseapp.com",
    projectId: "edugearswitch",
    storageBucket: "edugearswitch.appspot.com",
    messagingSenderId: "469465182342",
    appId: "1:469465182342:web:2c7a66d302dfbeecb1e107",
    measurementId: "G-7ELS14HC98"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase();

export default app;