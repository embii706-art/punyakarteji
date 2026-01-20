
import { authGuard } from './auth/authGuard.js';
export function initApp() {
  document.getElementById('app').innerHTML =
    '<h1 class="text-xl font-bold">KARTEJI v1.0 READY</h1>';
  authGuard();
}
