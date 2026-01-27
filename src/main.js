// Main Application Entry Point
import { authService } from './auth/auth.service.js';
import { themeManager } from './config/theme.js';
import { router } from './router.js';
import { initLayout } from './layout.js';
import { authGuard, guestGuard } from './auth/authGuard.js';

// Import pages
import { LoginPage } from './pages/login.js';
import { DashboardPage } from './pages/dashboard.js';
import { ProfilePage } from './pages/profile.js';
import { MembersPage } from './modules/anggota/index.js';
import { BankSampahPage } from './modules/bank-sampah/index.js';
import { FinancePage } from './modules/keuangan/index.js';
import { UMKMPage } from './modules/umkm/index.js';
import { AspirationPage } from './modules/aspiration/index.js';

// Helper function to show error messages
function showError(title, error) {
  const loadingEl = document.getElementById('loading') || document.body;
  loadingEl.innerHTML = `
    <div class="text-center text-white p-4">
      <h1 class="text-2xl font-bold mb-4">⚠️ ${title}</h1>
      <p class="mb-4">${error?.message || error || ''}</p>
      <button 
        onclick="location.reload()" 
        class="px-6 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100"
      >
        Reload
      </button>
    </div>
  `;
}

// Initialize app
async function initApp() {
  const startTime = Date.now();
  
  try {
    // 🚀 Starting KARTEJI app...
    
    // Show loading timeout warning after 5 seconds
    const timeoutWarning = setTimeout(() => {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) {
        const warningText = loadingEl.querySelector('p');
        if (warningText) {
          warningText.textContent = 'Loading taking longer than usual...';
        }
      }
    }, 5000);
    
    // Initialize auth service with race condition
    // 🔐 Initializing auth service...
    const authInitPromise = authService.init();
    
    // Set maximum wait time (10 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout - check your internet connection')), 10000);
    });
    
    await Promise.race([authInitPromise, timeoutPromise]);
    clearTimeout(timeoutWarning);
    // ✅ Auth service initialized

    const user = authService.getCurrentUser();
    // 👤 Current user: (hidden in production)
    
    const loadTime = Date.now() - startTime;
    // ⚡ App loaded (timing hidden in production)

    // Hide loading screen immediately
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      // 🔄 Hiding loading screen...
      loadingEl.style.display = 'none';
    }
    
    // Show root element immediately
    const rootEl = document.getElementById('root');
    if (rootEl) {
      // 👁️ Showing root element...
      rootEl.style.display = 'block';
    }

    if (!user) {
      // User not logged in - always show login screen
      showLoginScreen();
    } else {
      // User logged in - initialize app immediately
      localStorage.setItem('karteji_has_users', 'true');
      initMainApp();
    }
  } catch (error) {
    // ❌ Error initializing app:
    showError('Gagal memulai aplikasi', error);
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.opacity = '1';
      loadingEl.innerHTML = `
        <div class="text-center text-white p-4">
          <h1 class="text-2xl font-bold mb-4">⚠️ Error</h1>
          <p class="mb-4">${error.message}</p>
          <button 
            onclick="location.reload()" 
            class="px-6 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      `;
    }
  }
}

function showLoginScreen() {
  // 📄 Rendering login page...
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    // ❌ Root element not found!
    showError('Root element tidak ditemukan!');
    return;
  }
  
  rootEl.style.display = 'block';
  const loginHTML = LoginPage();
  // 📝 Login HTML length: (hidden in production)
  rootEl.innerHTML = loginHTML;
  // ✅ Login screen rendered
}

function showRegistrationScreen() {
  // 📄 Rendering registration page...
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    // ❌ Root element not found!
    showError('Root element tidak ditemukan!');
    return;
  }
  
  rootEl.style.display = 'block';
  const regHTML = LoginPage(true);
  // 📝 Registration HTML length: (hidden in production)
  rootEl.innerHTML = regHTML;
  // ✅ Registration screen rendered
}

function initMainApp() {
  // Initialize layout
  initLayout();

  // Register routes
  router.addRoute('/', DashboardPage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Dashboard - KARTEJI'
  });

  router.addRoute('/dashboard', DashboardPage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Dashboard - KARTEJI'
  });

  router.addRoute('/login', LoginPage, {
    guard: (next, redirect) => guestGuard(next, redirect),
    title: 'Login - KARTEJI'
  });

  router.addRoute('/profile', ProfilePage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Profile - KARTEJI'
  });

  router.addRoute('/members', MembersPage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Members - KARTEJI'
  });

  router.addRoute('/bank-sampah', BankSampahPage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Bank Sampah - KARTEJI'
  });

  router.addRoute('/finance', FinancePage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Finance - KARTEJI'
  });

  router.addRoute('/umkm', UMKMPage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'UMKM - KARTEJI'
  });

  router.addRoute('/aspiration', AspirationPage, {
    guard: (next, redirect) => authGuard(next, redirect),
    title: 'Kotak Aspirasi - KARTEJI'
  });

  // Initialize router
  router.init('app');

  // Listen to auth state changes
  authService.onAuthStateChange((user, profile) => {
    if (!user) {
      // User logged out - show login
      window.location.href = '/login';
    }
  });
}

// Start the app
// 🔥 Starting KARTEJI initialization...
initApp().catch(err => {
  // 💥 Fatal error during initialization:
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div class="text-center text-white p-4">
        <h1 class="text-2xl font-bold mb-4">❌ Fatal Error</h1>
        <p class="mb-2 text-red-200">${err.message}</p>
        <pre class="text-xs text-left bg-red-900 p-2 rounded mb-4 overflow-auto">${err.stack}</pre>
        <button 
          onclick="location.reload()" 
          class="px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100"
        >
          Reload Page
        </button>
      </div>
    `;
  }
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        // ServiceWorker registered (hidden in production)
      })
      .catch(error => {
        // ServiceWorker registration failed (hidden in production)
      });
  });
}
