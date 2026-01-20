// Layout component with bottom navigation
import { authService } from './auth/auth.service.js';
import { PERMISSIONS } from './auth/roles.js';

export function createLayout() {
  const profile = authService.getUserProfile();
  
  return `
    <!-- Main App Layout -->
    <div class="h-screen flex flex-col bg-gray-50">
      <!-- Top App Bar -->
      <header class="bg-primary-600 text-white shadow-lg">
        <div class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h1 class="text-lg font-bold">KARTEJI</h1>
              <p class="text-xs text-primary-100">Karang Taruna Digital</p>
            </div>
          </div>
          <button id="profileBtn" class="flex items-center space-x-2 hover:bg-primary-700 rounded-lg px-3 py-2 transition">
            <div class="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
              <span class="text-sm font-semibold">${profile?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main id="app" class="flex-1 overflow-y-auto pb-16">
        <!-- Content will be loaded here -->
      </main>

      <!-- Bottom Navigation -->
      <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div class="flex justify-around items-center h-16">
          ${createNavItem('dashboard', 'Dashboard', `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          `)}
          
          ${profile && authService.hasPermission(PERMISSIONS.VIEW_BANK_SAMPAH) ? createNavItem('bank-sampah', 'Bank Sampah', `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          `) : ''}
          
          ${profile && authService.hasPermission(PERMISSIONS.VIEW_FINANCE) ? createNavItem('finance', 'Finance', `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          `) : ''}
          
          ${profile && authService.hasPermission(PERMISSIONS.VIEW_UMKM) ? createNavItem('umkm', 'UMKM', `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          `) : ''}
          
          ${profile && authService.hasPermission(PERMISSIONS.CREATE_ASPIRATION) ? createNavItem('aspiration', 'Aspirasi', `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          `) : ''}
          
          ${createNavItem('profile', 'Profile', `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          `)}
        </div>
      </nav>
    </div>
  `;
}

function createNavItem(route, label, iconPath) {
  return `
    <a href="/${route}" data-route="${route}" class="nav-item flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-primary-600 transition">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${iconPath}
      </svg>
      <span class="text-xs mt-1">${label}</span>
    </a>
  `;
}

export function initLayout() {
  document.body.innerHTML = createLayout();
  
  // Handle navigation clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      window.navigateTo(`/${route}`);
      updateActiveNav(route);
    });
  });

  // Profile button handler
  document.getElementById('profileBtn')?.addEventListener('click', () => {
    window.navigateTo('/profile');
  });

  // Update active nav on load
  updateActiveNavFromPath();
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.route === route) {
      item.classList.add('text-primary-600');
      item.classList.remove('text-gray-600');
    } else {
      item.classList.remove('text-primary-600');
      item.classList.add('text-gray-600');
    }
  });
}

function updateActiveNavFromPath() {
  const path = window.location.pathname.replace('/', '');
  updateActiveNav(path || 'dashboard');
}
