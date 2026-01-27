// Layout component with bottom navigation
import { authService } from './auth/auth.service.js';
import { getSpecialTheme } from './config/specialTheme.js';
import { PERMISSIONS } from './auth/roles.js';

export function createLayout() {
  const profile = authService.getUserProfile();
  const special = getSpecialTheme(new Date());
  // Logo logic: dark/light/special
  let logo = '/logo.jpeg';
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (special && special.image) {
    logo = special.image;
  } else if (isDark && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If you have a dark logo, use it here (e.g. /logo-dark.jpeg)
    if (window.logoDark) logo = window.logoDark;
    else if (logo.endsWith('.jpeg')) logo = logo.replace('.jpeg', '-dark.jpeg');
    else if (logo.endsWith('.png')) logo = logo.replace('.png', '-dark.png');
  }
  return `
    <!-- Main App Layout -->
    <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <!-- Special Theme Banner & Animation -->
      ${special ? `
        <div class="w-full flex items-center justify-center py-2 bg-opacity-90" style="background:${special.color};color:#fff;">
          <img src="${special.image}" alt="${special.name}" class="h-10 w-10 object-contain mr-2 animate-bounce" style="background:transparent;">
          <span class="font-bold text-lg">${special.icon} ${special.banner}</span>
        </div>
      ` : ''}
      <!-- Top App Bar -->
      <header class="bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 text-white shadow-xl flex-shrink-0">
        <div class="px-4 py-3.5 flex items-center justify-between">
          <div class="flex items-center space-x-3 min-w-0 flex-1">
            <img src="${logo}" alt="Logo" class="w-10 h-10 rounded-xl object-cover flex-shrink-0 shadow-md" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <svg class="w-8 h-8 hidden flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div class="min-w-0">
              <h1 class="text-lg font-black truncate">KARTEJI</h1>
              <p class="text-xs text-white/90 hidden sm:block font-medium">Karang Taruna Digital</p>
            </div>
          </div>
          <button id="profileBtn" class="flex items-center hover:bg-white/20 rounded-xl px-3 py-2 transition-smooth flex-shrink-0">
            <div class="w-9 h-9 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
              <span class="text-sm font-bold">${profile?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main id="app" class="flex-1 overflow-y-auto pb-16 sm:pb-20">
        <!-- Content will be loaded here -->
      </main>

      <!-- Bottom Navigation -->
      <nav class="fixed bottom-0 left-0 right-0 glass-card border-t-2 border-primary-100 shadow-2xl z-50 flex-shrink-0 rounded-t-3xl animate-fade-in">
        <div class="flex justify-around items-center h-20 px-4 gap-1">
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
    <a href="/${route}" data-route="${route}" class="nav-item flex flex-col items-center justify-center flex-1 py-3 text-gray-500 hover:text-primary-600 transition-smooth relative group">
      <div class="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-premium mb-1.5">
        <svg class="w-6 h-6 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${iconPath}
        </svg>
      </div>
      <span class="text-xs font-bold transition-colors">${label}</span>
      <span class="active-indicator absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full opacity-0 transition-all duration-300 shadow-glow"></span>
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
    const indicator = item.querySelector('.active-indicator');
    const iconContainer = item.querySelector('div');
    if (item.dataset.route === route) {
      item.classList.add('text-primary-600');
      item.classList.remove('text-gray-500');
      if (indicator) indicator.style.opacity = '1';
      if (iconContainer) {
        iconContainer.classList.add('bg-gradient-to-br', 'from-primary-500', 'to-blue-500', 'shadow-glow');
        iconContainer.classList.remove('from-gray-100', 'to-gray-200');
      }
    } else {
      item.classList.remove('text-primary-600');
      item.classList.add('text-gray-500');
      if (indicator) indicator.style.opacity = '0';
      if (iconContainer) {
        iconContainer.classList.remove('bg-gradient-to-br', 'from-primary-500', 'to-blue-500', 'shadow-glow');
        iconContainer.classList.add('from-gray-100', 'to-gray-200');
      }
    }
  });
}

function updateActiveNavFromPath() {
  const path = window.location.pathname.replace('/', '');
  updateActiveNav(path || 'dashboard');
}
