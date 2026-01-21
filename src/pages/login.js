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
          ${setupFirstUser && !forceLoginMode ? `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" /></svg>
              <div>
                <div class="font-semibold text-blue-800 text-sm">Setup Administrator</div>
                <div class="text-xs text-blue-700">Anda adalah pengguna pertama. Akun Anda akan menjadi <b>Super Admin</b>.</div>
              </div>
            </div>
          ` : ''}

          ${!showLoginForm ? `
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="text-xs text-green-700">Pendaftaran anggota: role otomatis <b>anggota</b>.</span>
            </div>
          ` : ''}

          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
            ${showLoginForm ? 'Login' : (setupFirstUser ? 'Register Super Admin' : 'Register Anggota')}
          </h2>

          <form id="loginForm" class="space-y-4">
            ${!showLoginForm ? `
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" id="name" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Nama lengkap Anda" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                  <input type="tel" id="phone" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea id="address" rows="2" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Alamat lengkap"></textarea>
                </div>
              </div>
            ` : ''}

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="email@example.com" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" required minlength="6" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Min. 6 karakter" />
            </div>

            ${!showLoginForm ? `
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <input type="password" id="confirmPassword" required minlength="6" class="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Ketik ulang password" />
              </div>
            ` : ''}

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
            ${showLoginForm ? `
              <p class="text-sm text-gray-600">Belum punya akun? <span class="font-semibold text-primary-600">Daftar sebagai anggota</span> di bawah form ini.</p>
            ` : `
              <p class="text-sm text-gray-600">Sudah punya akun? <a href="#login" id="switchToLogin" class="text-primary-600 hover:underline font-semibold">Login di sini</a></p>
            `}
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p class="text-xs text-gray-500 mt-2">&copy; 2026 KARTEJI - Karang Taruna Digital</p>
        </div>
      </div>
    </div>
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
          // Cek apakah user pertama (belum ada user di Firestore)
          const setupFirstUser = isRegistration;
        document.getElementById('root').innerHTML = LoginPage(false);
      });
    }
          // Jika setupFirstUser true dan belum ada user, tampilkan register super_admin
          // Jika sudah ada user, tampilkan register anggota (mode register)
          let showLoginForm = !setupFirstUser || forceLoginMode;

          // Cek cache has_users
          let hasUsers = false;
          try {
            hasUsers = localStorage.getItem('karteji_has_users') === 'true';
          } catch {}

          // Jika sudah ada user, mode register anggota
          if (!showLoginForm && hasUsers) {
            // Register anggota
            showLoginForm = false;
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
