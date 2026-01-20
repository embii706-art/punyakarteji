// Firebase core configuration for KARTEJI
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('🔥 Initializing Firebase...');

// Firebase Web Config
const firebaseConfig = {
  apiKey: "AIzaSyC5L623gExYou8GXWvOlaKJAw-5An35ukI",
  authDomain: "karteji-e367d.firebaseapp.com",
  projectId: "karteji-e367d",
  storageBucket: "karteji-e367d.firebasestorage.app",
  messagingSenderId: "877730599886",
  appId: "1:877730599886:web:754465058330f6853ed19f"
};

// Initialize Firebase
let app, auth, db, storage;

try {
  console.log('📦 Firebase config:', { 
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain 
  });
  
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');

  // Firebase services
  auth = getAuth(app);
  
  // Set persistence to LOCAL (survives browser refresh)
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('✅ Firebase Auth persistence set to LOCAL');
    })
    .catch((error) => {
      console.warn('⚠️ Auth persistence error:', error.code, error.message);
    });
  
  console.log('✅ Firebase Auth initialized');
  
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
  
  storage = getStorage(app);
  console.log('✅ Firebase Storage initialized');
  
  console.log('🎉 All Firebase services ready!');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  throw error;
}

export { app, auth, db, storage };
