# KARTEJI - Karang Taruna Digital

> **Production-ready PWA** untuk manajemen Karang Taruna dengan dukungan mobile (Android & iOS)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-5.5.1-blue.svg)
![Status](https://img.shields.io/badge/status-75%25%20Complete-brightgreen.svg)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [RBAC System](#-rbac-system)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### **Core Features**
- 🔐 **Authentication** - Firebase Auth dengan first-user auto super_admin
- 🎯 **Detailed RBAC** - 7 fixed roles dengan 30+ granular permissions
- 📊 **Dashboard** - Real-time analytics dengan Chart.js
- 👥 **Member Management** - Kelola anggota dengan role assignment

### **Modules**
- ✅ **Members** - Full CRUD dengan role management
- ✅ **Kotak Aspirasi** - Member feedback system dengan admin management
- ⏳ **Bank Sampah** - Waste bank management (skeleton)
- ⏳ **Finance** - Financial management dengan approval workflow (skeleton)
- ⏳ **UMKM** - Product catalog dengan Cloudinary upload (skeleton)

### **UI/UX**
- 🌓 **Dark/Light Theme** - Toggle tema dengan localStorage persistence
- 📱 **Mobile-First** - Bottom navigation optimized untuk mobile
- 🎨 **Modern Design** - Tailwind CSS dengan gradient dan shadows

### **Technical**
- 📱 **PWA** - Installable pada web, Android (APK/AAB), iOS (IPA)
- 🔄 **Offline-first** - Service worker dengan cache strategy
- 🔒 **Secure** - Comprehensive Firestore security rules
- 💾 **Data Export** - PDF & Excel reports dengan jsPDF & xlsx

---

## 🚀 Quick Start

### **One-Line Install**

```bash
npm install && npm run dev
```

### **Manual Setup**

```bash
# 1. Clone repository
git clone https://github.com/embii706-art/punyakarteji.git
cd punyakarteji

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

### **First User Registration**

1. Buka aplikasi di browser
2. Akan muncul form registrasi (karena belum ada user)
3. Isi form dan register
4. **User pertama otomatis menjadi super_admin**
5. Login dan mulai kelola aplikasi

---

## 📁 Project Structure

```
punyakarteji/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── icon-placeholder.svg    # App icon
├── src/
│   ├── auth/
│   │   ├── auth.service.js     # Authentication service
│   │   ├── authGuard.js        # Route guards
│   │   └── roles.js            # ⭐ RBAC system (30+ permissions)
│   ├── config/
│   │   ├── firebase.js         # Firebase configuration
│   │   ├── cloudinary.js       # Cloudinary configuration
│   │   └── theme.js            # ⭐ Theme manager (Dark/Light)
│   ├── pages/
│   │   ├── login.js            # Login/Register page
│   │   ├── dashboard.js        # Dashboard dengan charts
│   │   └── profile.js          # Profile & theme toggle
│   ├── modules/
│   │   ├── anggota/            # ✅ Members management
│   │   ├── aspiration/         # ⭐ Kotak Aspirasi (NEW)
│   │   ├── bank-sampah/        # ⏳ Waste bank (skeleton)
│   │   ├── keuangan/           # ⏳ Finance (skeleton)
│   │   └── umkm/               # ⏳ UMKM (skeleton)
│   ├── layout.js               # App layout dengan navigation
│   ├── router.js               # SPA routing system
│   └── main.js                 # Application entry point
├── docs/
│   ├── QUICKSTART.md           # Quick setup guide
│   ├── DEVELOPMENT.md          # Development guide
│   ├── FEATURE_SUMMARY.md      # Latest features documentation
│   └── FINAL_DEPLOYMENT.md     # Deployment checklist
├── index.html                  # Main HTML file
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── firestore.rules             # Firestore security rules
├── capacitor.config.json       # Capacitor configuration
└── firebase.json               # Firebase hosting config
```

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Vanilla JavaScript (ES Modules)
- **Build Tool**: Vite 5.0.7
- **Styling**: Tailwind CSS 3.4.0 (CDN)
- **Charts**: Chart.js 4.4.0
- **Routing**: Custom SPA Router

### **Backend**
- **Authentication**: Firebase Auth 10.7.1
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage + Cloudinary
- **Hosting**: Firebase Hosting

### **Mobile**
- **Framework**: Capacitor 5.5.1
- **Platforms**: Android, iOS

### **Libraries**
- **PDF**: jsPDF 2.5.1
- **Excel**: xlsx 0.18.5
- **QR Code**: qrcode 1.5.3
- **Offline DB**: idb 8.0.0

---

## 🎯 RBAC System

### **7 Fixed Roles**

| Role | Label | Access Level |
|------|-------|--------------|
| `super_admin` | Super Administrator | Full system access |
| `ketua` | Ketua | Approve finance, monitor all |
| `wakil_ketua` | Wakil Ketua | Backup approval, view all data |
| `bendahara` | Bendahara | Manage finance |
| `sekretaris` | Sekretaris | Manage members & documentation |
| `humas` | Humas | Manage UMKM & public relations |
| `anggota` | Anggota | Submit waste & aspirations |

### **30+ Permissions**

```javascript
// Dashboard & Data
VIEW_DASHBOARD, VIEW_ALL_DATA

// Members
VIEW_MEMBERS, CREATE_MEMBER, EDIT_MEMBER, DELETE_MEMBER, MANAGE_ROLES

// Bank Sampah
VIEW_BANK_SAMPAH, CREATE_DEPOSIT, EDIT_DEPOSIT, DELETE_DEPOSIT, 
MANAGE_WASTE_SALES, GENERATE_REPORTS

// Finance
VIEW_FINANCE, CREATE_TRANSACTION, EDIT_TRANSACTION, DELETE_TRANSACTION,
APPROVE_TRANSACTION, VIEW_BALANCE

// UMKM
VIEW_UMKM, CREATE_UMKM, EDIT_UMKM, DELETE_UMKM, PUBLISH_UMKM

// Aspirations
VIEW_ASPIRATIONS, CREATE_ASPIRATION, MANAGE_ASPIRATIONS

// System
SYSTEM_SETTINGS, VIEW_AUDIT_LOG
```

### **Usage Example**

```javascript
import { authService } from './auth/auth.service.js';
import { PERMISSIONS } from './auth/roles.js';

// Check permission
if (authService.hasPermission(PERMISSIONS.CREATE_MEMBER)) {
  // Show "Add Member" button
}

// Check role
if (authService.isAdmin()) {
  // Admin-only features
}
```

---

## 💻 Development

### **Available Scripts**

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production Build
npm run build            # Build for production
npm run preview          # Preview production build

# Mobile Development
npm run cap:sync         # Sync web assets to mobile
npm run cap:open:android # Open Android Studio
npm run cap:open:ios     # Open Xcode

# Mobile Build
npm run cap:build:android # Build Android APK
npm run cap:build:ios     # Build iOS IPA
```

### **Environment Configuration**

Firebase dan Cloudinary sudah dikonfigurasi di:
- `src/config/firebase.js`
- `src/config/cloudinary.js`

Untuk production, pindahkan ke environment variables:

```bash
# .env.production
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### **Adding New Module**

```javascript
// 1. Create module file
// src/modules/your-module/index.js
export function YourModulePage() {
  return `<div>Your Module</div>`;
}

// 2. Register route in main.js
import { YourModulePage } from './modules/your-module/index.js';
router.addRoute('/your-module', YourModulePage, {
  guard: (next, redirect) => authGuard(next, redirect),
  title: 'Your Module - KARTEJI'
});

// 3. Add navigation in layout.js
${authService.hasPermission(PERMISSIONS.YOUR_PERMISSION) ? 
  createNavItem('your-module', 'Label', 'svg-icon') : ''}

// 4. Update Firestore rules
match /your_collection/{docId} {
  allow read, write: if isAuthenticated();
}
```

---

## 🚀 Deployment

### **Web Deployment (Firebase Hosting)**

```bash
# 1. Build production
npm run build

# 2. Deploy Firestore rules
firebase deploy --only firestore:rules

# 3. Deploy hosting
firebase deploy --only hosting

# Your app: https://karteji-e367d.web.app
```

### **Android Deployment**

```bash
# 1. Sync assets
npm run cap:sync

# 2. Open Android Studio
npm run cap:open:android

# 3. In Android Studio:
# Build → Generate Signed Bundle/APK
# Select "APK" or "AAB"
# Sign with your keystore

# Output: android/app/build/outputs/apk/release/
```

### **iOS Deployment**

```bash
# 1. Sync assets
npm run cap:sync

# 2. Open Xcode
npm run cap:open:ios

# 3. In Xcode:
# Product → Archive
# Distribute App
# Submit to App Store or export IPA

# Requirements:
# - macOS with Xcode
# - Apple Developer account ($99/year)
```

### **Pre-Deployment Checklist**

- [ ] Run `npm run build` without errors
- [ ] Test all features on dev server
- [ ] Verify Firebase config is correct
- [ ] Deploy Firestore rules
- [ ] Test PWA installation
- [ ] Check mobile responsiveness
- [ ] Verify offline functionality
- [ ] Test on real devices

---

## 🌟 Key Features Details

### **1. Kotak Aspirasi (Aspiration Box)**

Member feedback system dengan fitur:
- Submit aspirasi dengan kategori (kegiatan, lingkungan, UMKM, lain-lain)
- Optional anonymity toggle
- Admin dapat manage status (baru → diproses → selesai)
- Internal notes untuk admin
- Real-time badge untuk aspirasi baru

**File:** `src/modules/aspiration/index.js`

### **2. Dark/Light Theme**

Professional theme management:
- Toggle antara light dan dark mode
- Persists di localStorage
- System theme detection
- Smooth transition
- Mobile meta theme-color update

**File:** `src/config/theme.js`

**Usage:**
```javascript
import { themeManager } from './config/theme.js';

// Toggle theme
themeManager.toggle();

// Set specific theme
themeManager.setTheme('dark');

// Check current theme
themeManager.isDark(); // boolean
```

### **3. Detailed RBAC**

Comprehensive permission system:
- 7 fixed roles dengan responsibilities jelas
- 30+ granular permissions
- Helper functions untuk permission checking
- Role-based UI rendering
- Firestore rules enforcement

**File:** `src/auth/roles.js`

---

## 📊 Progress Status

**Overall Completion: 75%** ✅

| Module | Status | Completion |
|--------|--------|------------|
| Core Infrastructure | ✅ Complete | 100% |
| Authentication & RBAC | ✅ Complete | 100% |
| Theme System | ✅ Complete | 100% |
| Dashboard | ✅ Complete | 100% |
| Profile | ✅ Complete | 100% |
| Members | ✅ Complete | 100% |
| Kotak Aspirasi | ✅ Complete | 100% |
| Bank Sampah | ⏳ Skeleton | 15% |
| Finance | ⏳ Skeleton | 15% |
| UMKM | ⏳ Skeleton | 15% |
| PWA | ✅ Complete | 100% |
| Documentation | ✅ Complete | 100% |

---

## 🐛 Known Issues

None at the moment. Report issues at [GitHub Issues](https://github.com/embii706-art/punyakarteji/issues).

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

**Developer:** KARTEJI Development Team  
**Contact:** [GitHub](https://github.com/embii706-art/punyakarteji)

---

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Cloudinary for image storage
- Tailwind CSS for styling
- Chart.js for data visualization
- Capacitor for mobile deployment

---

## 📚 Documentation

For detailed guides, see:

- [Quick Start Guide](docs/QUICKSTART.md) - Get started in 5 minutes
- [Development Guide](docs/DEVELOPMENT.md) - Development best practices
- [Feature Summary](docs/FEATURE_SUMMARY.md) - Latest features documentation
- [Deployment Guide](docs/FINAL_DEPLOYMENT.md) - Complete deployment checklist

---

<div align="center">

**Made with ❤️ for Karang Taruna Indonesia**

[Report Bug](https://github.com/embii706-art/punyakarteji/issues) · [Request Feature](https://github.com/embii706-art/punyakarteji/issues)

</div>
