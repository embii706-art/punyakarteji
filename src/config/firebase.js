// Firebase core configuration for KARTEJI
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔥 Initializing Firebase...

// Firebase Web Config
const firebaseConfig = {
  apiKey: "AIzaSyC5L623gExYou8GXWvOlaKJAw-5An35ukI",
  authDomain: "karteji-e367d.firebaseapp.com",
  projectId: "karteji-e367d",
  storageBucket: "karteji-e367d.appspot.com",
  messagingSenderId: "877730599886",
  appId: "1:877730599886:web:754465058330f6853ed19f"
};

// Initialize Firebase
let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  // ✅ Firebase app initialized

  // Firebase Auth - fastest initialization
  auth = getAuth(app);
  // ✅ Firebase Auth initialized
  
  // Set persistence asynchronously - don't block
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('⚠️ Auth persistence error:', error.code);
  });
  
  // Initialize Firestore with optimized cache
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  // ✅ Firestore initialized
  
  // Enable offline persistence asynchronously - don't block
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Offline persistence: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Offline persistence: Not supported');
    }
  });
  
  // Storage - lazy init
  storage = getStorage(app);
  // ✅ Firebase Storage initialized
  
  // 🎉 Firebase ready!
} catch (error) {
  // ❌ Firebase initialization error:
  throw error;
}

export { app, auth, db, storage };
