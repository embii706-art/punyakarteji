// Login and Registration Page
import { authService } from '../auth/auth.service.js';

export function LoginPage(isRegistration = false) {
  // Mode: true = login, false = register
  let showLoginForm = !isRegistration ? true : false;

  const html = `
    <div class="min-h-screen bg-gradient-ocean flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <!-- Floating Background Elements -->
      <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-float" style="animation-delay: 2s;"></div>
      
      <div class="glass-card rounded-3xl shadow-premium w-full max-w-md overflow-hidden border-2 border-white/20 animate-slide-up">
        <!-- Header -->
        <div class="bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 text-white p-8 text-center relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-12 -mb-12"></div>
          
          <div class="relative z-10">
            <div class="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm animate-float">
              <svg class="w-12 h-12 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 class="text-3xl font-black tracking-tight mb-1">KARTEJI</h1>
            <p class="text-sm text-white/90 font-medium">Karang Taruna Digital</p>
          </div>
        </div>

        <!-- Form -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">${showLoginForm ? 'Selamat Datang! 👋' : 'Daftar Akun 🚀'}</h2>
          <form id="${showLoginForm ? 'loginForm' : 'registerForm'}" class="space-y-4">
            ${showLoginForm ? `
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.1s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" id="email" required class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="email@example.com" />
              </div>
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.2s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input type="password" id="password" required minlength="6" class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="Minimal 6 karakter" />
              </div>
            ` : `
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.1s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input type="text" id="name" required class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="Nama lengkap Anda" />
              </div>
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.15s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" id="email" required class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="email@example.com" />
              </div>
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.2s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input type="password" id="password" required minlength="6" class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="Minimal 6 karakter" />
              </div>
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.25s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
                <input type="password" id="confirmPassword" required minlength="6" class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="Ketik ulang password" />
              </div>
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.3s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nomor HP</label>
                <input type="tel" id="phone" class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white" placeholder="08xxxxxxxxxx" />
              </div>
              <div class="space-y-2 animate-slide-in-right" style="animation-delay: 0.35s;">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Alamat</label>
                <textarea id="address" rows="2" class="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white resize-none" placeholder="Alamat lengkap"></textarea>
              </div>
            `}
            <div id="errorMessage" class="hidden bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium animate-slide-up"></div>
            <button type="submit" id="submitBtn" class="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-premium flex items-center justify-center text-base shadow-premium hover:shadow-glow shadow-glow-hover">
              <span id="btnText">${showLoginForm ? '🚀 Login Sekarang' : '✨ Daftar Sekarang'}</span>
              <svg id="btnSpinner" class="hidden animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </form>
          <div class="my-6 flex items-center gap-3">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">atau</span>
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
          <div class="text-center">
            ${showLoginForm ? `<p class="text-sm text-gray-600">Belum punya akun? <a href="#" id="showRegister" class="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-colors">Daftar Sekarang ✨</a></p>` : `<p class="text-sm text-gray-600">Sudah punya akun? <a href="#" id="showLogin" class="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-colors">Login di sini 🚀</a></p>`}
          </div>
        </div>
        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 text-center border-t border-gray-200">
          <p class="text-xs text-gray-600 font-medium">© 2026 KARTEJI - Karang Taruna Digital 💚</p>
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
        document.getElementById('root').innerHTML = LoginPage(true);
      });
    }
    if (showLoginBtn) {
      showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('root').innerHTML = LoginPage(false);
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
          const phone = document.getElementById('phone').value;
          const address = document.getElementById('address').value;
          // Register user (anggota/super_admin)
          await authService.registerAnggota(name, email, password, phone, address);
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
