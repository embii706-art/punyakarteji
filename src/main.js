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

// Initialize app
async function initApp() {
  try {
    console.log('🚀 Starting KARTEJI app...');
    
    // Initialize auth service
    console.log('🔐 Initializing auth service...');
    await authService.init();
    console.log('✅ Auth service initialized');

    const user = authService.getCurrentUser();
    const hasUsers = await authService.hasAnyUser();
    console.log('👤 Current user:', user?.email || 'Not logged in');
    console.log('👥 Has users in system:', hasUsers);

    // Hide loading screen
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    if (!user) {
      // User not logged in
      if (!hasUsers) {
        // No users in system - show registration
        console.log('📝 Showing registration screen (first user)');
        showRegistrationScreen();
      } else {
        // Users exist - show login
        console.log('🔑 Showing login screen');
        showLoginScreen();
      }
    } else {
      // User logged in - initialize app
      console.log('✅ User logged in, initializing main app');
      initMainApp();
    }
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
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
  document.getElementById('root').innerHTML = '';
  const app = document.getElementById('root');
  app.innerHTML = LoginPage();
}

function showRegistrationScreen() {
  document.getElementById('root').innerHTML = '';
  const app = document.getElementById('root');
  app.innerHTML = LoginPage(true); // Pass true for registration mode
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
initApp();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
