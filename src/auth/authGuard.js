// Auth Guard for route protection
import { authService } from './auth.service.js';

/**
 * Auth Guard - protects routes that require authentication
 * @param {Function} next - Function to call if authenticated
 * @param {Function} redirectFn - Function to call if not authenticated
 */
export function authGuard(next, redirectFn) {
  const user = authService.getCurrentUser();
  const profile = authService.getUserProfile();
  const currentPath = window.location.pathname;

  if (user && profile) {
    // Check if user is active
    if (!profile.isActive) {
      authService.logout();
      if (currentPath !== '/login') redirectFn('/login');
      return false;
    }
    next();
    return true;
  } else {
    if (currentPath !== '/login') redirectFn('/login');
    return false;
  }
}

/**
 * Role Guard - protects routes that require specific role
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 * @param {Function} next - Function to call if authorized
 * @param {Function} redirectFn - Function to call if not authorized
 */
export function roleGuard(allowedRoles, next, redirectFn) {
  const profile = authService.getUserProfile();
  const currentPath = window.location.pathname;

  if (!profile) {
    if (currentPath !== '/login') redirectFn('/login');
    return false;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (roles.includes(profile.role)) {
    next();
    return true;
  } else {
    if (currentPath !== '/dashboard') redirectFn('/dashboard');
    return false;
  }
}

/**
 * Permission Guard - protects routes that require specific permission
 * @param {string} permission - Permission required
 * @param {Function} next - Function to call if authorized
 * @param {Function} redirectFn - Function to call if not authorized
 */
export function permissionGuard(permission, next, redirectFn) {
  const currentPath = window.location.pathname;
  if (authService.hasPermission(permission)) {
    next();
    return true;
  } else {
    if (currentPath !== '/dashboard') redirectFn('/dashboard');
    return false;
  }
}

/**
 * Guest Guard - protects routes that should only be accessible when not authenticated
 * @param {Function} next - Function to call if not authenticated
 * @param {Function} redirectFn - Function to call if authenticated
 */
export function guestGuard(next, redirectFn) {
  const user = authService.getCurrentUser();
  const currentPath = window.location.pathname;

  if (!user) {
    next();
    return true;
  } else {
    if (currentPath !== '/dashboard') redirectFn('/dashboard');
    return false;
  }
}
