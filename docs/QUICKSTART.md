# KARTEJI - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 First Time Setup

1. **No users exist yet** → You'll see the **Registration Form**
2. **Register** with your email and password
3. **You become Super Admin** automatically!
4. **Login** and start using the app

## 🎯 What's Built

✅ **Authentication System**
- Login/Register
- Role-based access control
- Auth guards

✅ **Dashboard**
- Quick stats
- Charts (Chart.js)
- Recent activities

✅ **Members Management**
- Add/edit members
- Assign roles
- Activate/deactivate users

✅ **Profile Page**
- View profile
- Logout

✅ **Module Skeletons**
- Bank Sampah (Waste Bank)
- Finance
- UMKM

✅ **PWA Setup**
- Service Worker
- Manifest
- Installable

✅ **Mobile-First UI**
- Bottom navigation
- Responsive design
- Touch-friendly

✅ **Capacitor Configuration**
- Ready for Android build
- Ready for iOS build

## 🔨 What Needs Implementation

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed implementation guide.

**Priority Tasks:**

1. **Bank Sampah Module**
   - Waste deposit form
   - Offline storage (IndexedDB)
   - QR code generation
   - Monthly reports

2. **Finance Module**
   - Transaction form
   - Approval workflow
   - Balance calculation
   - PDF/Excel export

3. **UMKM Module**
   - Product form
   - Image upload (Cloudinary)
   - Product catalog
   - Public page

4. **Digital Payments**
   - Backend integration
   - Xendit/Midtrans setup
   - Webhook handling

## 📁 Key Files

- `src/main.js` - App entry point
- `src/router.js` - SPA routing
- `src/layout.js` - App layout with bottom nav
- `src/auth/auth.service.js` - Authentication logic
- `src/config/firebase.js` - Firebase config
- `src/pages/` - Page components
- `src/modules/` - Feature modules
- `firestore.rules` - Database security rules

## 🔒 Roles & Permissions

- **super_admin** - Full access (first user)
- **ketua** - Leader, can approve transactions
- **wakil_ketua** - Vice leader, can approve
- **bendahara** - Treasurer, manages finance
- **sekretaris** - Secretary, manages members
- **humas** - Public relations, manages UMKM
- **anggota** - Regular member

## 🛠️ Tech Stack

- **Frontend**: Vanilla JS + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Storage**: Cloudinary
- **Charts**: Chart.js
- **PDF**: jsPDF
- **Build**: Vite
- **Mobile**: Capacitor

## 📚 Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Complete implementation guide
- [README](README.md) - Project overview

## 🆘 Need Help?

1. Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed guides
2. Review code comments in source files
3. Check Firebase/Firestore console for data
4. Use browser DevTools console for errors

## 🎉 Tips

- **First user is super_admin** - Register carefully!
- **Test offline mode** - Important for Bank Sampah
- **Mobile testing** - Use Chrome DevTools mobile view
- **Security rules** - Already configured in firestore.rules
- **Deployment** - Use Firebase Hosting

---

**Start building! The foundation is solid.** 🚀
