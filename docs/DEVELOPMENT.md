# KARTEJI Development Guide

## 🎯 Overview

This guide helps you complete and extend the KARTEJI application.

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Your config is already in [src/config/firebase.js](../src/config/firebase.js)

### 3. Deploy Firestore Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
```

### 4. Cloudinary Setup

1. Create account at [https://cloudinary.com](https://cloudinary.com)
2. Get your cloud name and upload preset
3. Config already in [src/config/cloudinary.js](../src/config/cloudinary.js)

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run preview
```

## 📱 Mobile Development

### Android Build

```bash
# Build web assets first
npm run build

# Initialize Capacitor (first time only)
npx cap init

# Add Android platform
npm run cap:add:android

# Sync web assets to native project
npm run cap:sync

# Open in Android Studio
npm run cap:open:android
```

In Android Studio:
1. Wait for Gradle sync
2. Connect device or start emulator
3. Click Run (green play button)

### iOS Build (macOS only)

```bash
# Build web assets
npm run build

# Add iOS platform
npm run cap:add:ios

# Sync assets
npm run cap:sync

# Open in Xcode
npm run cap:open:ios
```

In Xcode:
1. Select device/simulator
2. Click Run (play button)

## 🔨 Implementation Tasks

### Priority 1: Complete Core Features

#### 1. Bank Sampah Module (HIGH PRIORITY)

**File**: [src/modules/bank-sampah/index.js](../src/modules/bank-sampah/index.js)

Tasks:
- [ ] Implement waste deposit form
- [ ] Add household selection/creation
- [ ] Implement offline storage with IndexedDB (idb library)
- [ ] Add sync mechanism when online
- [ ] Generate QR codes for deposits (qrcode library)
- [ ] Implement QR scanner (use Capacitor Camera plugin)
- [ ] Create monthly recap function
- [ ] Add PDF export (jsPDF + jspdf-autotable)
- [ ] Add Excel export (xlsx library)

Example offline storage:
```javascript
import { openDB } from 'idb';

const db = await openDB('karteji-waste', 1, {
  upgrade(db) {
    db.createObjectStore('deposits', { keyPath: 'id', autoIncrement: true });
  }
});

// Save offline
await db.put('deposits', depositData);

// Sync when online
const deposits = await db.getAll('deposits');
// Upload to Firestore
```

#### 2. Finance Module (HIGH PRIORITY)

**File**: [src/modules/keuangan/index.js](../src/modules/keuangan/index.js)

Tasks:
- [ ] Create transaction form (income/expense)
- [ ] Implement approval workflow
- [ ] Add transaction list with filters
- [ ] Calculate and display balance
- [ ] Implement audit log
- [ ] Add PDF export for reports
- [ ] Add Excel export
- [ ] Create public transparency page (no auth required)

Approval flow:
```javascript
// Bendahara creates transaction
{
  type: 'income' | 'expense',
  amount: number,
  description: string,
  status: 'pending',
  createdBy: userId,
  createdAt: timestamp
}

// Ketua/Wakil approves
{
  status: 'approved',
  approvedBy: userId,
  approvedAt: timestamp
}
```

#### 3. UMKM Module (MEDIUM PRIORITY)

**File**: [src/modules/umkm/index.js](../src/modules/umkm/index.js)

Tasks:
- [ ] Create UMKM/product form
- [ ] Implement image upload to Cloudinary
- [ ] Add product catalog grid view
- [ ] Add product detail modal
- [ ] Implement search/filter
- [ ] Create public catalog page
- [ ] Add categories

Image upload example:
```javascript
import { uploadToCloudinary } from '../../config/cloudinary.js';

const file = input.files[0];
const result = await uploadToCloudinary(file);
// result.url contains the image URL
```

### Priority 2: Digital Payments Integration

#### Backend Setup (Required)

Payments MUST be processed server-side for security!

**Option A: Firebase Cloud Functions**

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

exports.createPayment = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated');
  
  // Create payment with Xendit/Midtrans
  const response = await axios.post('XENDIT_API_URL', {
    // payment data
  }, {
    headers: {
      'Authorization': `Basic ${Buffer.from(functions.config().xendit.secret + ':').toString('base64')}`
    }
  });
  
  // Save to Firestore
  await admin.firestore().collection('payments').add({
    userId: context.auth.uid,
    amount: data.amount,
    status: 'pending',
    externalId: response.data.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return response.data;
});

// Webhook handler
exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
  // Verify webhook signature
  // Update payment status in Firestore
  res.status(200).send('OK');
});
```

**Option B: Node.js Backend**

Create separate backend server with Express.js to handle payment API calls and webhooks.

### Priority 3: Enhanced Features

#### Dashboard Analytics

- [ ] Implement real-time data loading
- [ ] Add more chart types
- [ ] Create role-specific dashboards
- [ ] Add date range filters

#### Profile Management

- [ ] Allow users to edit their profiles
- [ ] Add avatar upload
- [ ] Implement password change
- [ ] Add email verification

#### Organization Structure

- [ ] Create org chart visualization
- [ ] Add member directory
- [ ] Implement member search

## 🧪 Testing

### Test First User Registration

1. Clear Firestore users collection
2. Clear browser localStorage
3. Reload app
4. Should show registration form
5. Register with email/password
6. Should become super_admin

### Test Role-Based Access

1. Login as super_admin
2. Go to Members page
3. Create users with different roles
4. Logout and login as each role
5. Verify correct permissions

### Test Offline Mode

1. Open Bank Sampah module
2. Go offline (DevTools Network → Offline)
3. Create waste deposit
4. Should save to IndexedDB
5. Go online
6. Should sync to Firestore

## 📚 Code Examples

### Creating a New Module

```javascript
// src/modules/my-module/index.js
import { authService } from '../../auth/auth.service.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';

export function MyModulePage() {
  // Check permissions
  if (!authService.hasPermission('my_permission')) {
    return `<div>Access Denied</div>`;
  }

  const html = `
    <div class="bg-gray-50 min-h-screen pb-20">
      <!-- Your content here -->
    </div>
  `;

  // Setup handlers after render
  setTimeout(() => {
    setupHandlers();
  }, 0);

  return html;
}

function setupHandlers() {
  // Add event listeners
}
```

### Adding Route

```javascript
// src/main.js
import { MyModulePage } from './modules/my-module/index.js';

router.addRoute('/my-module', MyModulePage, {
  guard: (next, redirect) => authGuard(next, redirect),
  title: 'My Module - KARTEJI'
});
```

### Firestore Operations

```javascript
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

// Create
await addDoc(collection(db, 'items'), {
  name: 'Item',
  createdAt: serverTimestamp()
});

// Read all
const snapshot = await getDocs(collection(db, 'items'));
snapshot.forEach(doc => console.log(doc.data()));

// Query
const q = query(
  collection(db, 'items'),
  where('status', '==', 'active'),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const results = await getDocs(q);

// Update
await updateDoc(doc(db, 'items', 'item-id'), {
  name: 'Updated'
});

// Delete
await deleteDoc(doc(db, 'items', 'item-id'));
```

## 🐛 Common Issues & Solutions

### Issue: Module not found errors

**Solution**: Ensure all imports use correct relative paths and `.js` extensions

### Issue: Firestore permission denied

**Solution**: 
1. Check Firestore rules
2. Verify user is authenticated
3. Check user role and permissions

### Issue: Capacitor build fails

**Solution**:
1. Run `npm run build` first
2. Run `npx cap sync`
3. Check capacitor.config.json paths

### Issue: Service Worker not registering

**Solution**:
1. Check HTTPS (required for SW except localhost)
2. Verify sw.js path
3. Check browser console for errors

## 📖 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Contributing

When adding new features:
1. Follow existing code structure
2. Add comments for complex logic
3. Update this guide
4. Test on mobile devices
5. Verify Firestore rules

## 📝 Notes

- Always test offline functionality for Bank Sampah
- Never store API keys in frontend code
- Use proper error handling and user feedback
- Keep UI mobile-first
- Follow RBAC principles
- Test on real devices, not just browsers

---

**Happy Coding! 🚀**
