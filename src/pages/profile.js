// Profile Page
import { authService } from '../auth/auth.service.js';
import { themeManager, THEMES } from '../config/theme.js';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export function ProfilePage() {
  const profile = authService.getUserProfile();

  const html = `
    <div class="bg-gray-50 min-h-screen pb-20">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 text-center">
        <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="text-4xl font-bold text-primary-600">${profile?.name?.charAt(0).toUpperCase() || 'U'}</span>
        </div>
        <h2 class="text-2xl font-bold">${profile?.name || 'User'}</h2>
        <p class="text-primary-100">${profile?.email || ''}</p>
        <div class="inline-block bg-primary-500 rounded-full px-4 py-1 mt-2">
          <span class="text-sm font-semibold">${getRoleLabel(profile?.role)}</span>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="p-4 space-y-4">
        <div class="bg-white rounded-xl shadow-md p-4">
          <h3 class="font-semibold text-gray-800 mb-4">Informasi Pribadi</h3>
          
          <div class="space-y-3">
            <div>
              <label class="text-xs text-gray-600">Nama Lengkap</label>
              <p class="text-sm font-medium text-gray-800">${profile?.name || '-'}</p>
            </div>
            
            <div>
              <label class="text-xs text-gray-600">Email</label>
              <p class="text-sm font-medium text-gray-800">${profile?.email || '-'}</p>
            </div>
            
            <div>
              <label class="text-xs text-gray-600">Nomor HP</label>
              <p class="text-sm font-medium text-gray-800">${profile?.phone || '-'}</p>
            </div>
            
            <div>
              <label class="text-xs text-gray-600">Alamat</label>
              <p class="text-sm font-medium text-gray-800">${profile?.address || '-'}</p>
            </div>
            
            <div>
              <label class="text-xs text-gray-600">Role</label>
              <p class="text-sm font-medium text-gray-800">${getRoleLabel(profile?.role)}</p>
            </div>
          </div>

          <button 
            onclick="editProfile()"
            class="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Edit Profile
          </button>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-xl shadow-md divide-y">
          ${authService.isAdmin() ? `
          <button 
            onclick="navigateTo('/members')"
            class="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="font-medium text-gray-800">Kelola Anggota</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          ` : ''}

          <button 
            id="themeToggle"
            onclick="toggleTheme()"
            class="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div class="flex items-center space-x-3">
              <svg id="themeIcon" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <span class="font-medium text-gray-800">Mode Tema</span>
                <p id="themeLabel" class="text-xs text-gray-500">Light Mode</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            onclick="showAbout()"
            class="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium text-gray-800">Tentang Aplikasi</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            onclick="handleLogout()"
            class="w-full p-4 flex items-center justify-between hover:bg-red-50 transition"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="font-medium text-red-600">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Update theme UI
    updateThemeUI();

    // Setup global functions
    window.toggleTheme = () => {
      themeManager.toggle();
      updateThemeUI();
    };

    window.handleLogout = async () => {
      if (confirm('Apakah Anda yakin ingin logout?')) {
        await authService.logout();
        window.location.reload();
      }
    };


    window.editProfile = () => {
      const profile = authService.getUserProfile();
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
          <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">&times;</button>
          <h2 class="text-xl font-bold mb-4">Edit Profil</h2>
          <form id="editProfileForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" id="editName" value="${profile?.name || ''}" required class="w-full px-4 py-3 border rounded-xl" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
              <input type="tel" id="editPhone" value="${profile?.phone || ''}" class="w-full px-4 py-3 border rounded-xl" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea id="editAddress" rows="2" class="w-full px-4 py-3 border rounded-xl">${profile?.address || ''}</textarea>
            </div>
            <div id="editProfileError" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm"></div>
            <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl">Simpan</button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      setTimeout(() => {
        const form = document.getElementById('editProfileForm');
        const errorDiv = document.getElementById('editProfileError');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          errorDiv.classList.add('hidden');
          const name = document.getElementById('editName').value.trim();
          const phone = document.getElementById('editPhone').value.trim();
          const address = document.getElementById('editAddress').value.trim();
          try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User tidak ditemukan');
            await updateDoc(doc(db, 'users', user.uid), {
              name,
              phone,
              address,
              updatedAt: new Date()
            });
            modal.remove();
            window.location.reload();
          } catch (err) {
            errorDiv.textContent = err.message || 'Gagal update profil';
            errorDiv.classList.remove('hidden');
          }
        });
      }, 0);
    };

    window.showAbout = () => {
      alert('KARTEJI v1.0.0\nKarang Taruna Digital\n© 2026');
    };
  }, 0);

  return html;
}

function updateThemeUI() {
  const isDark = themeManager.isDark();
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  if (icon && label) {
    if (isDark) {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
      icon.classList.remove('text-yellow-500');
      icon.classList.add('text-indigo-500');
      label.textContent = 'Dark Mode';
    } else {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
      icon.classList.remove('text-indigo-500');
      icon.classList.add('text-yellow-500');
      label.textContent = 'Light Mode';
    }
  }
}

function getRoleLabel(role) {
  const labels = {
    super_admin: 'Super Administrator',
    ketua: 'Ketua',
    wakil_ketua: 'Wakil Ketua',
    bendahara: 'Bendahara',
    sekretaris: 'Sekretaris',
    humas: 'Humas',
    anggota: 'Anggota'
  };
  return labels[role] || role;
}
