// Router for KARTEJI SPA
import { authGuard, guestGuard } from './auth/authGuard.js';

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.appContainer = null;
  }

  /**
   * Initialize router
   */
  init(containerId = 'app') {
    this.appContainer = document.getElementById(containerId);

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    // Handle initial route
    this.navigate(window.location.pathname, false);
  }

  /**
   * Register a route
   */
  addRoute(path, component, options = {}) {
    this.routes[path] = {
      component,
      guard: options.guard || null,
      title: options.title || 'KARTEJI'
    };
  }

  /**
   * Navigate to a route
   */
  async navigate(path, pushState = true) {
    const route = this.routes[path];

    if (!route) {
      // Try to match dynamic routes
      const matchedRoute = this.matchDynamicRoute(path);
      if (matchedRoute) {
        await this.loadRoute(matchedRoute, path, pushState);
        return;
      }
      // Route not found - avoid infinite redirect loop
      if (path === '/dashboard') {
        // Already at dashboard, show 404 message
        document.body.innerHTML = `<div class="flex items-center justify-center h-screen"><div class="text-center"><h1 class="text-2xl font-bold text-red-600 mb-2">404 - Halaman tidak ditemukan</h1><p class="text-gray-600">Halaman <b>${path}</b> tidak tersedia.</p></div></div>`;
        return;
      }
      console.warn(`Route not found: ${path}`);
      this.navigate('/dashboard', pushState);
      return;
    }

    await this.loadRoute(route, path, pushState);
  }

  /**
   * Match dynamic routes (e.g., /profile/:id)
   */
  matchDynamicRoute(path) {
    for (const routePath in this.routes) {
      if (routePath.includes(':')) {
        const pattern = routePath.replace(/:[^\s/]+/g, '([\\w-]+)');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(path)) {
          return this.routes[routePath];
        }
      }
    }
    return null;
  }

  /**
   * Load route component
   */
  async loadRoute(route, path, pushState) {
    // Check guards
    if (route.guard) {
      const allowed = route.guard(
        () => { }, // next
        (redirectPath) => this.navigate(redirectPath, true) // redirect
      );

      if (!allowed) return;
    }

    // Update URL
    if (pushState) {
      window.history.pushState({}, '', path);
    }

    // Update document title
    document.title = route.title;

    // Load component
    try {
      if (!this.appContainer) {
        // App container not found
        document.body.innerHTML = `<div class="flex items-center justify-center h-screen"><div class="text-center"><h1 class="text-2xl font-bold text-red-600 mb-2">App Container Not Found</h1><button onclick="window.location.href='/dashboard'" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">Go to Dashboard</button></div></div>`;
        return;
      }

      // Clear current content
      this.appContainer.innerHTML = '';

      // Load component
      if (typeof route.component === 'function') {
        const content = await route.component();
        if (typeof content === 'string') {
          this.appContainer.innerHTML = content;
        } else {
          this.appContainer.appendChild(content);
        }
      } else {
        this.appContainer.innerHTML = route.component;
      }

      this.currentRoute = path;
    } catch (error) {
      // Error loading route:
      this.appContainer.innerHTML = `
        <div class="flex items-center justify-center h-screen">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-red-600 mb-2">Error Loading Page</h1>
            <p class="text-gray-600">${error.message}</p>
            <button onclick="window.location.href='/dashboard'" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">
              Go to Dashboard
            </button>
          </div>
        </div>
      `;
    }
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Create navigation link handler
   */
  link(path) {
    return (e) => {
      e.preventDefault();
      this.navigate(path);
    };
  }
}

// Export singleton instance
export const router = new Router();

// Global navigation helper
window.navigateTo = (path) => router.navigate(path);
