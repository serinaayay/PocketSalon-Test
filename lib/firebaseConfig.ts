// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEKbFejccBML9TZ2eSOwgJC7juwMlzAAs",
  authDomain: "pocket-salon-db.firebaseapp.com",
  projectId: "pocket-salon-db",
  storageBucket: "pocket-salon-db.firebasestorage.app",
  messagingSenderId: "814872962717",
  appId: "1:814872962717:android:030a9de458dad9e3835674"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

