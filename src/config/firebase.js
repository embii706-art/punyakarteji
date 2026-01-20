
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const app = initializeApp({
 apiKey:"AIzaSyC5L623gExYou8GXWvOlaKJAw-5An35ukI",
 authDomain:"karteji-e367d.firebaseapp.com",
 projectId:"karteji-e367d"
});

export const auth = getAuth(app);
export const db = getFirestore(app);
