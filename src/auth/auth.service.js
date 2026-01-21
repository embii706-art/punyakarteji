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
import { hasPermission, isAdmin } from './roles.js';

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
    /**
     * Register anggota (user biasa, role: anggota)
     */
    async registerAnggota(name, email, password, phone = '', address = '') {
      try {
        // Cek apakah email sudah terdaftar
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          throw new Error('Email sudah terdaftar');
        }
        // Cek apakah ini user pertama
        const allUsersSnap = await getDocs(usersRef);
        const isFirstUser = allUsersSnap.empty;
        // Buat user auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Buat profile user, role super_admin jika user pertama, anggota jika bukan
        const userProfile = {
          email: user.email,
          role: isFirstUser ? ROLES.SUPER_ADMIN : ROLES.ANGGOTA,
          name: name || '',
          phone: phone || '',
          address: address || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
        // Jika user pertama (super_admin), buat dokumen /config/app
        if (isFirstUser) {
          try {
            await setDoc(doc(db, 'config', 'app'), { hasSuperAdmin: true }, { merge: true });
          } catch (e) { /* ignore */ }
        }
        this.currentUser = user;
        this.userProfile = { id: user.uid, ...userProfile };
        return { user, profile: this.userProfile };
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('Email sudah terdaftar');
        }
        if (error.code === 'auth/weak-password') {
          throw new Error('Password terlalu lemah (min. 6 karakter)');
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('Format email tidak valid');
        }
        throw error;
      }
    }
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
      
      // Update cache - users now exist in system
      localStorage.setItem('karteji_has_users', 'true');

      return { user, profile: this.userProfile };
    } catch (error) {
      console.error('Error registering first user:', error);
      
      // Provide more helpful error messages
      if (error.code === 'auth/configuration-not-found') {
        const helpfulError = new Error(
          'Firebase Authentication belum dikonfigurasi.\n\n' +
          '📝 Langkah setup:\n' +
          '1. Buka Firebase Console: https://console.firebase.google.com/project/karteji-e367d/authentication/providers\n' +
          '2. Klik "Get Started" atau "Add new provider"\n' +
          '3. Pilih "Email/Password"\n' +
          '4. Toggle "Enable" menjadi ON\n' +
          '5. Klik "Save"\n' +
          '6. Refresh halaman ini dan coba lagi'
        );
        helpfulError.code = error.code;
        throw helpfulError;
      }
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email sudah terdaftar');
      }
      
      if (error.code === 'auth/weak-password') {
        throw new Error('Password terlalu lemah (min. 6 karakter)');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('Format email tidak valid');
      }
      
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
      
      // Provide more helpful error messages
      if (error.code === 'auth/configuration-not-found') {
        const helpfulError = new Error(
          'Firebase Authentication belum dikonfigurasi. ' +
          'Silakan aktifkan Email/Password sign-in di Firebase Console: ' +
          'https://console.firebase.google.com/project/karteji-e367d/authentication/providers'
        );
        helpfulError.code = error.code;
        throw helpfulError;
      }
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('Email tidak ditemukan');
      }
      
      if (error.code === 'auth/wrong-password') {
        throw new Error('Password salah');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('Format email tidak valid');
      }
      
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Terlalu banyak percobaan login. Coba lagi nanti.');
      }
      
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
    return hasPermission(this.userProfile.role, permission);
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
    return isAdmin(this.userProfile.role);
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
