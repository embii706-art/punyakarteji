// Bank Sampah Module with Offline Support
import { authService } from '../../auth/auth.service.js';

export function BankSampahPage() {
  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-green-600 text-white p-4">
        <h1 class="text-xl font-bold">Bank Sampah</h1>
        <p class="text-sm text-green-100">Kelola setoran sampah rumah tangga</p>
      </div>

      <div class="p-4">
        <button 
          onclick="showAddDepositModal()"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Setoran Sampah
        </button>

        <div id="depositsList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Fitur Bank Sampah sedang dalam pengembangan
          </div>
        </div>
      </div>
    </div>
  `;
}

export default function init() {
  console.log("Bank Sampah Module Ready");
}
