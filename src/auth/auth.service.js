// Authentication Service for KARTEJI
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

// Define roles (FIXED - cannot be deleted)
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  KETUA: 'ketua',
  WAKIL_KETUA: 'wakil_ketua',
  BENDAHARA: 'bendahara',
  SEKRETARIS: 'sekretaris',
  HUMAS: 'humas',
  ANGGOTA: 'anggota'
};

// Role permissions
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'], // All permissions
  [ROLES.KETUA]: ['dashboard', 'members', 'bank_sampah', 'finance', 'umkm', 'approve', 'view_all'],
  [ROLES.WAKIL_KETUA]: ['dashboard', 'members', 'bank_sampah', 'finance', 'umkm', 'approve', 'view_all'],
  [ROLES.BENDAHARA]: ['dashboard', 'finance', 'bank_sampah', 'create_transaction', 'view_all'],
  [ROLES.SEKRETARIS]: ['dashboard', 'members', 'bank_sampah', 'umkm', 'view_all'],
  [ROLES.HUMAS]: ['dashboard', 'umkm', 'view_public'],
  [ROLES.ANGGOTA]: ['dashboard', 'profile', 'view_own']
};

class AuthService {
  constructor() {
    this.currentUser = null;
    this.userProfile = null;
    this.authStateListeners = [];
  }

  /**
   * Initialize auth state listener
   */
  init() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          await this.loadUserProfile();
        } else {
          this.currentUser = null;
          this.userProfile = null;
        }
        
        // Notify all listeners
        this.authStateListeners.forEach(listener => listener(user, this.userProfile));
        resolve(user);
      });
    });
  }

  /**
   * Add auth state change listener
   */
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Load user profile from Firestore
   */
  async loadUserProfile() {
    if (!this.currentUser) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      if (userDoc.exists()) {
        this.userProfile = { id: userDoc.id, ...userDoc.data() };
        return this.userProfile;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Check if any user exists in the system
   */
  async hasAnyUser() {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking users:', error);
      return false;
    }
  }

  /**
   * Register first user (becomes super_admin automatically)
   */
  async registerFirstUser(email, password, userData) {
    try {
      // Check if users exist
      const hasUsers = await this.hasAnyUser();
      if (hasUsers) {
        throw new Error('Users already exist. Contact admin to create new users.');
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile with super_admin role
      const userProfile = {
        email: user.email,
        role: ROLES.SUPER_ADMIN,
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      this.currentUser = user;
      this.userProfile = { id: user.uid, ...userProfile };

      return { user, profile: this.userProfile };
    } catch (error) {
      console.error('Error registering first user:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;
      await this.loadUserProfile();

      // Check if user is active
      if (this.userProfile && !this.userProfile.isActive) {
        await this.logout();
        throw new Error('Your account has been deactivated. Contact administrator.');
      }

      return { user: this.currentUser, profile: this.userProfile };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.userProfile = null;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get current user profile
   */
  getUserProfile() {
    return this.userProfile;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission) {
    if (!this.userProfile) return false;
    
    const role = this.userProfile.role;
    const permissions = ROLE_PERMISSIONS[role] || [];
    
    return permissions.includes('*') || permissions.includes(permission);
  }

  /**
   * Check if user has role
   */
  hasRole(role) {
    if (!this.userProfile) return false;
    return this.userProfile.role === role;
  }

  /**
   * Check if user is admin (super_admin, ketua, or wakil_ketua)
   */
  isAdmin() {
    if (!this.userProfile) return false;
    return [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA].includes(this.userProfile.role);
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin() {
    return this.hasRole(ROLES.SUPER_ADMIN);
  }
}

// Export singleton instance
export const authService = new AuthService();
