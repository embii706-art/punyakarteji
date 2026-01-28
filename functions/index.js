// Firebase Cloud Function: Create Firestore user doc on Auth user creation
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Triggered when a new user is created in Firebase Auth

// Helper: cek apakah user pertama (tidak ada user lain di Firestore)
async function isFirstUser() {
  const snap = await db.collection('users').limit(1).get();
  return snap.empty;
}

// Helper: custom logic role
function getInitialRole(user, isFirst) {
  // Daftar email admin, tambahkan sesuai kebutuhan
  const adminEmails = [
    'admin@domain.com',
    'admin2@domain.com',
    'admin3@domain.com',
    'admin4@domain.com'
    // Tambahkan email lain di sini
  ];
  if (isFirst) return 'super_admin';
  if (adminEmails.includes(user.email)) return 'admin';
  return 'anggota';
}

// Helper: ambil custom claims jika ada
function getClaim(user, key) {
  return user.customClaims && user.customClaims[key] ? user.customClaims[key] : '';
}

async function toUserProfile(user) {
  const first = await isFirstUser();
  return {
    email: user.email || '',
    name: getClaim(user, 'name') || user.displayName || '',
    phone: getClaim(user, 'phone') || user.phoneNumber || '',
    address: getClaim(user, 'address') || '',
    role: getInitialRole(user, first),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    isActive: true
  };
}

exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  const userRef = db.collection('users').doc(user.uid);
  const userProfile = await toUserProfile(user);
  await userRef.set(userProfile, { merge: true });
  console.log(`User profile created for UID: ${user.uid}`);
});
