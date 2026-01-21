// Theme Management System
// Supports Dark and Light modes with localStorage persistence

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

const STORAGE_KEY = 'karteji-theme';

// CSS variable definitions for each theme
const THEME_STYLES = {
  [THEMES.LIGHT]: {
    // Background colors
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f9fafb',
    '--bg-tertiary': '#f3f4f6',
    
    // Text colors
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--text-tertiary': '#9ca3af',
    
    // Border colors
    '--border-primary': '#e5e7eb',
    '--border-secondary': '#d1d5db',
    
    // Brand colors (unchanged)
    '--color-primary': '#0ea5e9',
    '--color-primary-dark': '#0284c7',
    '--color-primary-light': '#38bdf8',
    
    // Status colors
    '--color-success': '#10b981',
    '--color-warning': '#f59e0b',
    '--color-error': '#ef4444',
    '--color-info': '#3b82f6',
    
    // Card & shadow
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  
  [THEMES.DARK]: {
    // Background colors
    '--bg-primary': '#1f2937',
    '--bg-secondary': '#111827',
    '--bg-tertiary': '#374151',
    
    // Text colors
    '--text-primary': '#f9fafb',
    '--text-secondary': '#d1d5db',
    '--text-tertiary': '#9ca3af',
    
    // Border colors
    '--border-primary': '#374151',
    '--border-secondary': '#4b5563',
    
    // Brand colors (slightly adjusted for dark mode)
    '--color-primary': '#38bdf8',
    '--color-primary-dark': '#0ea5e9',
    '--color-primary-light': '#7dd3fc',
    
    // Status colors (adjusted for dark mode)
    '--color-success': '#34d399',
    '--color-warning': '#fbbf24',
    '--color-error': '#f87171',
    '--color-info': '#60a5fa',
    
    // Card & shadow
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.5)',
  }
};

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.listeners = [];
  }

  /**
   * Get system theme preference
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    return THEMES.LIGHT;
  }

  /**
   * Get stored theme from localStorage
   */
  getStoredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && Object.values(THEMES).includes(stored)) {
        return stored;
      }
    } catch (error) {
      // Error reading theme from storage:
    }
    return null;
  }

  /**
   * Store theme preference
   */
  storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Error storing theme:
    }
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    const root = document.documentElement;
    const styles = THEME_STYLES[theme];

    if (!styles) {
      // Invalid theme:
      return;
    }

    // Apply CSS variables
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update data attribute for CSS targeting
    root.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === THEMES.DARK ? '#1f2937' : '#0ea5e9');
    }

    this.currentTheme = theme;
    this.storeTheme(theme);

    // Notify listeners
    this.listeners.forEach(callback => callback(theme));
  }

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    const newTheme = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    this.applyTheme(newTheme);
    return newTheme;
  }

  /**
   * Set specific theme
   */
  setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
      // Invalid theme:
      return;
    }
    this.applyTheme(theme);
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   */
  isDark() {
    return this.currentTheme === THEMES.DARK;
  }

  /**
   * Initialize theme system
   */
  init() {
    // Apply current theme
    this.applyTheme(this.currentTheme);

    // Listen for system theme changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Modern browsers
      if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener('change', (e) => {
          // Only auto-switch if user hasn't manually set a preference
          if (!this.getStoredTheme()) {
            this.applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
          }
        });
      }
      // Older browsers
      else if (darkModeQuery.addListener) {
        darkModeQuery.addListener((e) => {
          if (!this.getStoredTheme()) {
            this.applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
          }
        });
      }
    }
  }

  /**
   * Subscribe to theme changes
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Unsubscribe from theme changes
   */
  offChange(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// Initialize on import
themeManager.init();
