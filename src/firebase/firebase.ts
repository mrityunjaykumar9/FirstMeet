// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config from Console
const firebaseConfig = {

  apiKey: "AIzaSyCTBEpWuiqkorBm_o1NK-A_FE4w2OOxMeo",
  authDomain: "firstmeet-fbadf.firebaseapp.com",
  projectId: "firstmeet-fbadf",
  storageBucket: "firstmeet-fbadf.firebasestorage.app",
  messagingSenderId: "573694396123",
  appId: "1:573694396123:web:87eccc362ff0a5e8882efe",
  measurementId: "G-FLJQQ2X14Z"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
