// Login and Registration Page
import { authService } from '../auth/auth.service.js';

export function LoginPage(isRegistration = false) {
  // Mode: true = login, false = register
  let showLoginForm = isRegistration ? false : true;

  const html = `
    <div class="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-primary-100">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6 text-center relative">
          <div class="absolute top-4 right-4">
            <svg class="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
            </svg>
          </div>
          <svg class="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">KARTEJI</h1>
          <p class="text-sm sm:text-base text-primary-100 font-medium">Karang Taruna Digital</p>
        </div>

        <!-- Form -->
        <div class="p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">${showLoginForm ? 'Login' : 'Register'}</h2>
          <form id="${showLoginForm ? 'loginForm' : 'registerForm'}" class="space-y-4">
            ${showLoginForm ? `
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="email@example.com" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="password" required minlength="6" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Min. 6 karakter" />
              </div>
            ` : `
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" id="name" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Nama lengkap Anda" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="email@example.com" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="password" required minlength="6" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Min. 6 karakter" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <input type="password" id="confirmPassword" required minlength="6" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Ketik ulang password" />
              </div>
            `}
            <div id="errorMessage" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"></div>
            <button type="submit" id="submitBtn" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center text-base shadow-md hover:shadow-lg">
              <span id="btnText">${showLoginForm ? 'Login' : 'Register'}</span>
              <svg id="btnSpinner" class="hidden animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </form>
          <div class="my-6 flex items-center gap-2">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-xs text-gray-400 font-semibold">atau</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>
          <div class="text-center">
            ${showLoginForm ? `<p class="text-sm text-gray-600">Belum punya akun? <a href="#" id="showRegister" class="text-primary-600 hover:underline font-semibold">Daftar / Register</a></p>` : `<p class="text-sm text-gray-600">Sudah punya akun? <a href="#" id="showLogin" class="text-primary-600 hover:underline font-semibold">Login di sini</a></p>`}
          </div>
        </div>
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p class="text-xs text-gray-500 mt-2">&copy; 2026 KARTEJI - Karang Taruna Digital</p>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Toggle login/register
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    if (showRegisterBtn) {
      showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('root').innerHTML = LoginPage(false);
      });
    }
    if (showLoginBtn) {
      showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('root').innerHTML = LoginPage(true);
      });
    }
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      const submitBtn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const btnSpinner = document.getElementById('btnSpinner');
      const errorMessage = document.getElementById('errorMessage');
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        try {
          await authService.login(email, password);
          window.location.href = '/dashboard';
        } catch (error) {
          errorMessage.textContent = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
          errorMessage.classList.remove('hidden');
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
        }
      });
    }
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      const submitBtn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const btnSpinner = document.getElementById('btnSpinner');
      const errorMessage = document.getElementById('errorMessage');
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        errorMessage.classList.add('hidden');
        if (password.length < 6) {
          errorMessage.textContent = 'Password minimal 6 karakter';
          errorMessage.classList.remove('hidden');
          return;
        }
        if (password !== confirmPassword) {
          errorMessage.textContent = 'Konfirmasi password tidak cocok';
          errorMessage.classList.remove('hidden');
          return;
        }
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        try {
          // Register user (anggota)
          await authService.registerAnggota(name, email, password);
          // Login otomatis setelah register
          await authService.login(email, password);
          window.location.href = '/dashboard';
        } catch (error) {
          errorMessage.textContent = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
          errorMessage.classList.remove('hidden');
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
        }
      });
    }
  }, 0);

  return html;
}
