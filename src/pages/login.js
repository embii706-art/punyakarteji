// Login and Registration Page
import { authService } from '../auth/auth.service.js';

export function LoginPage(isRegistration = false) {
  // Check if this is first user registration
  const setupFirstUser = isRegistration;
  
  // Allow manual mode override via URL hash
  const urlMode = window.location.hash;
  const forceLoginMode = urlMode === '#login';
  const showLoginForm = !setupFirstUser || forceLoginMode;

  const html = `
    <div class="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <!-- Header -->
        <div class="bg-primary-600 text-white p-4 sm:p-6 text-center">
          <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 class="text-xl sm:text-2xl font-bold">KARTEJI</h1>
          <p class="text-xs sm:text-sm text-primary-100">Karang Taruna Digital</p>
        </div>

        <!-- Form -->
        <div class="p-4 sm:p-6">
          ${setupFirstUser && !forceLoginMode ? `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <p class="text-xs sm:text-sm text-blue-800">
                <strong>Setup Administrator</strong><br/>
                Anda adalah pengguna pertama. Akun Anda akan menjadi Super Admin.
              </p>
            </div>
          ` : ''}

          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            ${showLoginForm ? 'Login' : 'Register Super Admin'}
          </h2>

          <form id="loginForm" class="space-y-3 sm:space-y-4">
            ${!showLoginForm ? `
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  class="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Nomor HP</label>
                <input 
                  type="tel" 
                  id="phone"
                  class="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Alamat</label>
                <textarea 
                  id="address"
                  rows="2"
                  class="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Alamat lengkap"
                ></textarea>
              </div>
            ` : ''}

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                required
                class="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                required
                minlength="6"
                class="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Min. 6 karakter"
              />
            </div>

            ${!showLoginForm ? `
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Konfirmasi Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  required
                  minlength="6"
                  class="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ketik ulang password"
                />
              </div>
            ` : ''}

            <div id="errorMessage" class="hidden bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm"></div>

            <button 
              type="submit" 
              id="submitBtn"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition duration-200 flex items-center justify-center text-sm sm:text-base"
            >
              <span id="btnText">${showLoginForm ? 'Login' : 'Register'}</span>
              <svg id="btnSpinner" class="hidden animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 sm:px-6 py-4 text-center">
          ${showLoginForm ? `
            <p class="text-xs sm:text-sm text-gray-600">
              Belum punya akun? Hubungi administrator.
            </p>
          ` : `
            <p class="text-xs sm:text-sm text-gray-600">
              Sudah punya akun? <a href="#login" id="switchToLogin" class="text-primary-600 hover:underline font-semibold">Login di sini</a>
            </p>
          `}
          <p class="text-xs text-gray-500 mt-2">
            &copy; 2026 KARTEJI - Karang Taruna Digital
          </p>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const switchToLoginBtn = document.getElementById('switchToLogin');

    // Handle switch to login mode
    if (switchToLoginBtn) {
      switchToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Switching to login mode
        window.location.hash = 'login';
        // Re-render page in login mode
        document.getElementById('root').innerHTML = LoginPage(false);
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        try {
          if (!showLoginForm) {
            // Registration
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone')?.value || '';
            const address = document.getElementById('address')?.value || '';
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
              throw new Error('Password tidak cocok');
            }

            await authService.registerFirstUser(email, password, {
              name,
              phone,
              address
            });

            // Reload to initialize main app
            window.location.href = '/dashboard';
          } else {
            // Login
            await authService.login(email, password);
            
            // Reload to initialize main app
            window.location.href = '/dashboard';
          }
        } catch (error) {
          // Auth error:
          errorMessage.textContent = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
          errorMessage.classList.remove('hidden');

          // Reset button
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
        }
      });
    }
  }, 0);

  return html;
}
