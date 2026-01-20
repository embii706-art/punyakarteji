// Finance Module with Approval Flow
import { authService } from '../../auth/auth.service.js';

export function FinancePage() {
  const isAdmin = authService.isAdmin();
  const isBendahara = authService.hasRole('bendahara');

  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-yellow-600 text-white p-4">
        <h1 class="text-xl font-bold">Keuangan</h1>
        <p class="text-sm text-yellow-100">Manajemen kas masuk & keluar</p>
      </div>

      <div class="p-4">
        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
          <p class="text-sm text-gray-600 mb-1">Saldo Kas</p>
          <p class="text-3xl font-bold text-gray-800">Rp 0</p>
        </div>

        ${isBendahara || isAdmin ? `
        <button 
          onclick="showAddTransactionModal()"
          class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Transaksi
        </button>
        ` : ''}

        <div id="transactionsList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Fitur Keuangan sedang dalam pengembangan
          </div>
        </div>
      </div>
    </div>
  `;
}

export default function init() {
  console.log("Keuangan Module Ready");
}
