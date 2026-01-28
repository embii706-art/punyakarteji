// Firebase core configuration for KARTEJI
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Web Config
const firebaseConfig = {
  apiKey: "AIzaSyC5L623gExYou8GXWvOlaKJAw-5An35ukI",
  authDomain: "karteji-e367d.firebaseapp.com",
  projectId: "karteji-e367d",
  storageBucket: "karteji-e367d.firebasestorage.app",
  messagingSenderId: "877730599886",
  appId: "1:877730599886:web:754465058330f6853ed19f",
  measurementId: "G-4KNXCFGTE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Persist auth session (async, non-blocking)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('⚠️ Auth persistence error:', error.code);
});

// Firestore (NEW CACHE API — FUTURE PROOF)
const db = initializeFirestore(app, {
  cache: {
    kind: "persistent",          // IndexedDB
    // synchronizeTabs: true,     // enable if you want multi-tab sync
  },
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Storage
const storage = getStorage(app);

export { app, auth, db, storage };
