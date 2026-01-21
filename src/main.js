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
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting KARTEJI app...');
    
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
    console.log('🔐 Initializing auth service...');
    const authInitPromise = authService.init();
    
    // Set maximum wait time (10 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout - check your internet connection')), 10000);
    });
    
    await Promise.race([authInitPromise, timeoutPromise]);
    clearTimeout(timeoutWarning);
    console.log('✅ Auth service initialized');

    const user = authService.getCurrentUser();
    console.log('👤 Current user:', user?.email || 'Not logged in');
    
    const loadTime = Date.now() - startTime;
    console.log(`⚡ App loaded in ${loadTime}ms`);

    // Hide loading screen immediately
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      console.log('🔄 Hiding loading screen...');
      loadingEl.style.display = 'none';
    }
    
    // Show root element immediately
    const rootEl = document.getElementById('root');
    if (rootEl) {
      console.log('👁️ Showing root element...');
      rootEl.style.display = 'block';
    }

    if (!user) {
      // User not logged in - check if users exist
      // Use cached result if available for faster loading
      const cachedHasUsers = localStorage.getItem('karteji_has_users');
      let hasUsers = cachedHasUsers === 'true';
      
      if (cachedHasUsers === null) {
        // First time - need to check
        console.log('🔍 Checking for existing users...');
        hasUsers = await authService.hasAnyUser();
        localStorage.setItem('karteji_has_users', hasUsers.toString());
      }
      
      console.log('👥 Has users in system:', hasUsers);
      
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
      // User logged in - initialize app immediately
      console.log('✅ User logged in, initializing main app');
      // Set cache to true since we know users exist
      localStorage.setItem('karteji_has_users', 'true');
      initMainApp();
    }
  } catch (error) {
    console.error('❌ Error initializing app:', error);
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
  console.log('📄 Rendering login page...');
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error('❌ Root element not found!');
    return;
  }
  
  rootEl.style.display = 'block';
  const loginHTML = LoginPage();
  console.log('📝 Login HTML length:', loginHTML?.length || 0);
  rootEl.innerHTML = loginHTML;
  console.log('✅ Login screen rendered');
}

function showRegistrationScreen() {
  console.log('📄 Rendering registration page...');
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error('❌ Root element not found!');
    return;
  }
  
  rootEl.style.display = 'block';
  const regHTML = LoginPage(true);
  console.log('📝 Registration HTML length:', regHTML?.length || 0);
  rootEl.innerHTML = regHTML;
  console.log('✅ Registration screen rendered');
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
console.log('🔥 Starting KARTEJI initialization...');
initApp().catch(err => {
  console.error('💥 Fatal error during initialization:', err);
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div class="text-center text-white p-4">
        <h1 class="text-2xl font-bold mb-4">❌ Error</h1>
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
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
console.log("initApp called");
console.log("authService.init resolved");
