// UMKM Module with Cloudinary Integration
import { authService } from '../../auth/auth.service.js';

export function UMKMPage() {
  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-purple-600 text-white p-4">
        <h1 class="text-xl font-bold">UMKM</h1>
        <p class="text-sm text-purple-100">Katalog produk UMKM</p>
      </div>

      <div class="p-4">
        ${authService.hasPermission('umkm') ? `
        <button 
          onclick="showAddUMKMModal()"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Produk UMKM
        </button>
        ` : ''}

        <div id="umkmList" class="grid grid-cols-2 gap-3">
          <div class="col-span-2 text-center py-8 text-gray-500">
            Fitur UMKM sedang dalam pengembangan
          </div>
        </div>
      </div>
    </div>
  `;
}

export default function init() {
  console.log("UMKM Module Ready");
}
